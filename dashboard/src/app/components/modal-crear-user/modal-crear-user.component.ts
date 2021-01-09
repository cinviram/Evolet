import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiUserService } from '../../service-api/api-user/api-user.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-modal-crear-user',
  templateUrl: './modal-crear-user.component.html',
  styleUrls: ['./modal-crear-user.component.css']
})
export class ModalCrearUserComponent implements OnInit {

  //telefonos prefijos
  listaTelefonos:Object[]=[];

  //seccion firebase
  task: AngularFireUploadTask;

  //variables de estado
  mostrarEmpresaCargo=false

  //url imagen perfil
  url;
  imgObject:any;
  

  constructor(public bsModalRef: BsModalRef,public ApiUserService: ApiUserService,private storage: AngularFireStorage) { 
   
  }

  ngOnInit(): void {
    this.ApiUserService.obtenerTelefonos().subscribe(data=>{
      let dataTransform:any=data
      this.listaTelefonos=dataTransform;

      console.log(this.listaTelefonos)
    })
  }

  crearUsuario(){

    let nuevoUsuario=this.obtenerUsuarioNuevo();
    
    //valido si el usuario está correcto
    let resultado=this.validarUsuario(nuevoUsuario);
    if(resultado){
      //cambiando el estado de boton crear usuario
      this.cambiarTextoButton();
      //funcion para subir foto de perfil primero a firebase
      this.uploadFile(this.imgObject, nuevoUsuario); //dentro registro el usuario
    }

    
  }

  obtenerUsuarioNuevo(){
    var objectNombre:any = document.getElementById("inputNombres");
    var objectCorreo:any = document.getElementById("inputCorreo");
    var objectPrefijo:any = document.getElementById("selectPrefijo");
    var objectCelular:any = document.getElementById("inputCelular");
    var objectAlias:any = document.getElementById("inputAlias");
    var objectSexo:any = document.getElementById("selectSexo");
    var objectFecha:any = document.getElementById("inputFecha")
    var objectTipo:any = document.getElementById("selectTipoUser")
    var objectEmpresa:any = document.getElementById("inputEmpresa")
    var objectCargo:any = document.getElementById("inputCargo")
    var objectPassword:any = document.getElementById("inputPassword")

    var nombres= objectNombre.value
    var correo=  objectCorreo.value
    var prefijo= objectPrefijo.value
    var celular= objectCelular.value
    //actualizacion del numero celular con el prefijo
    celular=prefijo+celular;
    var alias= objectAlias.value
    var sexo= objectSexo.value
    var fecha= objectFecha.value
    var tipo= objectTipo.value
    
    var empresa= ''
      var cargo= ''

    if(tipo=='empresarial'){
      empresa= objectEmpresa.value
      cargo= objectCargo.value
    }
    
    var password= objectPassword.value

    let usuarioNuevo={'nombres': nombres, 'correo': correo, 'celular': celular, 'sexo': sexo, 'fechaNac': fecha, 
                      'alias': alias,'tipoUser': tipo, 'empresa': empresa, 'cargo': cargo, 
                      'fotoPerfil': '', 'password': password
    }

    //

    return usuarioNuevo

  }

  cambioTipo(event){
    console.log(event)

    var objectTipo:any = document.getElementById("selectTipoUser")
    var tipo= objectTipo.value
    if(tipo=='empresarial'){
      this.mostrarEmpresaCargo=true;
    }else{
      this.mostrarEmpresaCargo=false
    }
  }

  readUrl(event:any) { 
    if (event.target.files && event.target.files[0]) { 
      var reader = new FileReader(); 

      reader.onload = (event:any) => { 
      this.url = event.target.result; 
      } 

      reader.readAsDataURL(event.target.files[0]); 

      //imagen temporal
      let imagenUrl=event.target.files[0];
      console.log(imagenUrl)

      // Validation for Images Only
      if (imagenUrl.type.split('/')[0] !== 'image') { 
        console.error('unsupported file type :( ') 
        return;
      }
    
      this.imgObject=imagenUrl;
    } 
  }
  
  //Subir archivo a firebase
  uploadFile(file,usuario) {
    
    // The storage path
    const path = `img_perfiles/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Foto de perfil de los usuarios' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    this.task.then(result=>{
      console.log('tarea completada ',result)
      let objectImg=fileRef.getDownloadURL()
      objectImg.subscribe(resp=>{
        let rutaImgFirebase=resp

        usuario.fotoPerfil=rutaImgFirebase;

        console.log(usuario)
        //registrando usuario a la base 
        this.ApiUserService.crearUsuario(usuario).subscribe(data=>{
          console.log(data);
          if(data['exito']){
            this.restaurarTextoButton();
            this.alertaExito();
          }
        })
        
      })
    })

  }


  //funciones de validacion
  validarUsuario(usuario){

    this.removerClaseInvalid()
    
    let status=true;

    if(usuario['nombres']==''){
      var elemento = document.getElementById("inputNombres");
      elemento.className += " is-invalid";
      status=false;
    }

    if(usuario['correo']==''){
      var elemento = document.getElementById("inputCorreo");
      elemento.className += " is-invalid";
      status=false;
    }

    var objectCelular:any = document.getElementById("inputCelular");

    if(objectCelular['value']==''){
      var elemento = document.getElementById("inputCelular");
      elemento.className += " is-invalid";
      status=false;
    }

    if(usuario['fechaNac']==''){
      var elemento = document.getElementById("inputFecha");
      elemento.className += " is-invalid";
      status=false;
    }

    if(usuario['tipoUser']=='empresarial'){
      if(usuario['empresa']==''){
        var elemento = document.getElementById("inputEmpresa");
        elemento.className += " is-invalid";
        status=false;
      }
  
      if(usuario['cargo']==''){
        var elemento = document.getElementById("inputCargo");
        elemento.className += " is-invalid";
        status=false;
      }
    }

    

    if(!this.url){
      var elemento = document.getElementById("imgPerfil");
      elemento.className += " is-invalid";
      status=false;
    }

    if(usuario['password']==''){
      var elemento = document.getElementById("inputPassword");
      elemento.className += " is-invalid";
      status=false;
    }else{
      if(usuario['password'].length<6){
        var elemento = document.getElementById("inputPassword");
        elemento.className += " is-invalid";
        status=false;
      }
    }

    return status
  }

  removerClaseInvalid(){
    var element1 = document.getElementById("inputNombres");
    var element2 = document.getElementById("inputCorreo");
    var element3 = document.getElementById("inputCelular");
    var element4 = document.getElementById("inputFecha");
    var element5 = document.getElementById("inputEmpresa");
    var element6 = document.getElementById("inputCargo");
    var element7 = document.getElementById("imgPerfil");
    var element8= document.getElementById("inputPassword");
   
    element1.classList.remove("is-invalid");
    element2.classList.remove("is-invalid");
    element3.classList.remove("is-invalid");
    element4.classList.remove("is-invalid");
    if(element5 && element6){
      element5.classList.remove("is-invalid");
      element6.classList.remove("is-invalid");
    }
    
    element7.classList.remove("is-invalid");
    element8.classList.remove("is-invalid");
  }

  cambiarTextoButton(){
    var uno = document.getElementById('btn_crear');
    uno.innerHTML='Creando ...'
    uno.setAttribute('disabled', "true");

  }

  restaurarTextoButton(){
    var uno = document.getElementById('btn_crear');
    uno.innerHTML='Crear Usuario'
    uno.removeAttribute('disabled');

  }

  cerrarModal(){
    this.bsModalRef.hide();
  }

  alertaExito(){
    Swal.fire(
      'Exito',
      'Usuario creado exitosamente',
      'success'
    ).then(data=>{
      this.cerrarModal();
    })
  }

}
