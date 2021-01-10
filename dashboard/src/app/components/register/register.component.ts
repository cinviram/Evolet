import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
//Import - servicio
import { AuthService } from '../../auth/auth.service';

import { ApiUserService } from '../../service-api/api-user/api-user.service'
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  url;
  imgObject: any;
  //seccion firebase
  task: AngularFireUploadTask;

  //Variable - constructor
  constructor(
    public AuthService: AuthService, private storage: AngularFireStorage, private usuarioService: ApiUserService
  ) { }

  ngOnInit(): void {
  }

  crearAdministrador(email, password) {
    //validar primero
    //this.cambiarTextoButton();

    console.log(email, password)
    let usuarioNuevo = this.obtenerUsuarioNuevo();
    console.log(usuarioNuevo)
    //funcion para subir foto de perfil primero a firebase
    this.uploadFile(this.imgObject, usuarioNuevo); //dentro registro el evento

  }

  obtenerUsuarioNuevo() {
    var objectNombre: any = document.getElementById("name")
    var objectAlias: any = document.getElementById("username")
    var objectCorreo: any = document.getElementById("email")
    var objectPassword: any = document.getElementById("password")
    var objectTelefono: any = document.getElementById("telefono")
    var objectEmpresa: any = document.getElementById("empresa")
    var objectSexo: any = document.getElementById("sexo");
    var objectFecha: any = document.getElementById("fec_nac");
    var objectLinkedin: any = document.getElementById("linkedin");

    var name = objectNombre.value
    var username = objectAlias.value
    var email = objectCorreo.value
    var password = objectPassword.value
    var telefono = objectTelefono.value
    var empresa = objectEmpresa.value
    var sexo = objectSexo.value
    var fec_nac = objectFecha.value
    var rol = 'administrador'
    var linkedin = objectLinkedin.value
    var imgEvento = ''

    //Evento nuevo
    let usuarioNuevo = {
      'nombre': name, 'alias': username, 'email': email,
      'password': password, 'telefono': telefono, 'empresa': empresa,
      'sexo': sexo, 'fecha': fec_nac, 'imgEvento': '', 'rol': rol, 'linkedin': linkedin
    }
    return usuarioNuevo
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);

      //imagen temporal
      let imagenUrl = event.target.files[0];
      console.log(imagenUrl)

      // Validation for Images Only
      if (imagenUrl.type.split('/')[0] !== 'image') {
        console.error('unsupported file type :( ')
        return;
      }

      this.imgObject = imagenUrl;
    }
  }

  //Subir archivo a firebase
  uploadFile(file, usuario) {

    // The storage path
    const path = `img_eventos/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Foto de los eventos generales' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    this.task.then(result => {
      console.log('tarea completada ', result)
      let objectImg = fileRef.getDownloadURL()
      objectImg.subscribe(resp => {
        let rutaImgFirebase = resp

        usuario.imgEvento = rutaImgFirebase;

        console.log(usuario)
        //registrando evento a la base 
        this.usuarioService.crearAdmin(usuario).subscribe(result => {
          console.log('respuesta: ', result)
          if (result['exito']) {
            this.AuthService.SignUp(usuario.email, usuario.password).then(data => {
              Swal.fire(
                'Exito',
                'Usuario creado',
                'success'
              ).then(response => {
                location.reload();
              })
            })

          }
        })


      })
    })

  }

}


