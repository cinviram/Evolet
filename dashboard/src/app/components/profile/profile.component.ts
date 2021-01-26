import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiUserService } from '../../service-api/api-user/api-user.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public usuarioActual: any;
  //variables de configuracion
  statusInput = true;
  name_button_edit = 'Editar'
  banderaImg=false; //significa que en false, no ha subido ninguna foto nueva.
  url=''
  imgObject

  //seccion firebase
   task: AngularFireUploadTask;

  constructor(
    public AuthService: AuthService,
    public ApiUserService: ApiUserService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    let infoUser = localStorage.getItem('evolet-user');
    let objectoUser = JSON.parse(infoUser);
    this.usuarioActual = objectoUser;
    this.url=this.usuarioActual.avatar;

    console.log(this.usuarioActual)

  }

  EditarAdministrador(event) {
    console.log(event.target.id)
    if (this.statusInput == true) {
      this.statusInput = false
      this.cambiarTextoEditarGuardar()
      
      
    } else {
      console.log('Guardando...')
      this.cambiarTextoButton();
      //console.log(this.usuarioActual)
      let usuarioActualizado = this.obtenerAdminActualizado();
      
      if(this.banderaImg){ //si la bandera ha cambiado a true es porque ha subido una imagen nueva
        //funcion para subir foto de perfil primero a firebase
        this.uploadFile(this.imgObject, usuarioActualizado); //dentro registro el evento
      }else{
        this.ApiUserService.actualizarAdmin(usuarioActualizado).subscribe(result=>{
          console.log('respuesta: ',result)
          if(result['exito']){
            Swal.fire(
              'Exito',
              'Administrador actualizado',
              'success'
            ).then(response=>{
              localStorage.setItem('evolet-user',JSON.stringify(usuarioActualizado))
              location.reload();
            })
          }
        })
      }

      
    }
  }

 
  obtenerAdminActualizado(){
  
    var objectNombre:any = document.getElementById("nombres")
    var objectCorreo:any = document.getElementById("correo")
    var objectCelular:any = document.getElementById("telefono")
    var objectAlias:any = document.getElementById("alias")
    var objectSexo:any = document.getElementById("sexo")
    var objectFecha:any = document.getElementById("fec_nac")
    var objectEmpresa:any = document.getElementById("empresa")
    var objectLinkedin:any = document.getElementById("linkedin")

    
    var nombre= objectNombre.value
    var correo=  objectCorreo.value
    var telefono= objectCelular.value
    var alias= objectAlias.value
    var sexo= objectSexo.value
    var fecha= objectFecha.value
    var empresa= objectEmpresa.value
    var linkedin= objectLinkedin.value

    //Admin editado
    let usuarioModificado={'idUser': this.usuarioActual.idDoc,'nombre': nombre, 
                            'correo':correo, 'telefono':telefono, 'alias':alias, 'sexo':sexo,
                            'fecha_nac':fecha,'empresa':empresa,'linkedin':linkedin,
                            'avatar': this.usuarioActual.avatar, 'password': this.usuarioActual.password,
                            'rol': this.usuarioActual.rol

                          }
    
    console.log('Admin nuevo: ',usuarioModificado)
    return usuarioModificado
  }

  readUrl(event:any) { 

    if(this.banderaImg==false){ //primera vez que va a cambiar la imagen
      this.banderaImg=true; 
      console.log('ha subid una imagen')
    }

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
  uploadFile(file,usuarioActualizado) {
    
    // The storage path
    const path = `img_eventos/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Foto de los eventos generales' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    this.task.then(result=>{
      console.log('tarea completada ',result)
      let objectImg=fileRef.getDownloadURL()
      objectImg.subscribe(resp=>{
      let rutaImgFirebase=resp

      usuarioActualizado.avatar=rutaImgFirebase;

        console.log(usuarioActualizado)
        //registrando evento a la base 
        this.ApiUserService.actualizarAdmin(usuarioActualizado).subscribe(result=>{
          console.log('respuesta: ',result)
          if(result['exito']){
            Swal.fire(
              'Exito',
              'Administrador actualizado',
              'success'
            ).then(response=>{
              localStorage.setItem('evolet-user',JSON.stringify(usuarioActualizado))
              location.reload();
            })
          }
        })
        
        
      })
    })

  }

  cambiarTextoEditarGuardar() {
    var uno = document.getElementById('btn_editar');
    uno.innerHTML = 'Guardar'
    
  }

  cambiarTextoButton() {
    var uno = document.getElementById('btn_editar');
    uno.innerHTML = 'Actualizando ...'
    uno.setAttribute('disabled', "true");

  }



}
