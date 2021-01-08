import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiUserService } from '../../service-api/api-user/api-user.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-modal-crear-user',
  templateUrl: './modal-crear-user.component.html',
  styleUrls: ['./modal-crear-user.component.css']
})
export class ModalCrearUserComponent implements OnInit {


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
  }

  crearUsuario(){

    let nuevoUsuario=this.obtenerUsuarioNuevo();
    
    //funcion para subir foto de perfil primero a firebase
    this.uploadFile(this.imgObject, nuevoUsuario); //dentro registro el usuario


  }

  obtenerUsuarioNuevo(){
    var objectNombre:any = document.getElementById("inputNombres");
    var objectCorreo:any = document.getElementById("inputCorreo");
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
    var celular= objectCelular.value
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
        })
        
      })
    })

  }

  

}
