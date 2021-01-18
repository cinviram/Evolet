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
  usuarioIncorrecto:boolean=false;

  listaErrores=['*Complete los campos en rojo']
  //mensajeError='*Complete los campos en rojo'

  //Variable - constructor
  constructor(
    public AuthService: AuthService, private storage: AngularFireStorage, private usuarioService: ApiUserService
  ) { }

  ngOnInit(): void {
  }

  crearAdministrador() {
    
    let usuarioNuevo = this.obtenerUsuarioNuevo();
    //validar primero
    let valido=this.validarFormularioRegistro(usuarioNuevo);

    if(!valido){
      this.usuarioIncorrecto=true;
    }else{
      console.log('usuaro validado')
      this.removeItemFromArr(this.listaErrores,'Complete los campos en rojo');
      this.actualizarEstadoRegistrar();
      this.uploadFile(this.imgObject, usuarioNuevo); //dentro registro el evento
    }


  }

  obtenerUsuarioNuevo() {
    var objectNombre: any = document.getElementById("name")
    var objectAlias: any = document.getElementById("alias")
    var objectCorreo: any = document.getElementById("email")
    var objectPassword: any = document.getElementById("password")
    var objectTelefono: any = document.getElementById("telefono")
    var objectEmpresa: any = document.getElementById("empresa")
    var objectSexo: any = document.getElementById("sexo");
    var objectFecha: any = document.getElementById("fec_nac");
    var objectLinkedin: any = document.getElementById("linkedin");

    var name = objectNombre.value
    var alias = objectAlias.value
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
      'nombre': name, 'alias': alias, 'email': email,
      'password': password, 'telefono': telefono, 'empresa': empresa,
      'sexo': sexo, 'fecha': fec_nac, 'imgEvento': '', 'rol': rol, 'linkedin': linkedin
    }
    return usuarioNuevo
  }

  validarFormularioRegistro(usuarioNuevo){
    this.removerClaseInvalid();

    let status=true; //asumo que el usuario es correcto

    if(usuarioNuevo['nombre']==''){
      var elemento = document.getElementById("name");
      elemento.className += " campo_invalido";
      status=false;
    }

    if(usuarioNuevo['alias']==''){
      var elemento = document.getElementById("alias");
      elemento.className += " campo_invalido";
      status=false;
    }

    if(usuarioNuevo['email']==''){
      var elemento = document.getElementById("email");
      elemento.className += " campo_invalido";
      status=false;
    }else{
      //validando que formato de correo
      console.log('hola0')
      console.log(usuarioNuevo['email'])
      console.log(this.validarEmail(usuarioNuevo['email']))
      if(!this.validarEmail(usuarioNuevo['email'])){
        var elemento = document.getElementById("email");

        if(this.listaErrores.indexOf('*Correo invalido')==-1)
          this.listaErrores.push('*Correo invalido')
        elemento.className += " campo_invalido";
        status=false;

      }else{
        this.removeItemFromArr(this.listaErrores,'*Correo invalido')
        
      }
    }


    if(usuarioNuevo['empresa']==''){
      var elemento = document.getElementById("empresa");
      elemento.className += " campo_invalido";
      status=false;
    }


    if(usuarioNuevo['password']==''){
      var elemento = document.getElementById("password");
      elemento.className += " campo_invalido";
      status=false;
    }

    if(document.getElementById("password2")['value']==''){
      var elemento = document.getElementById("password2");
      elemento.className += " campo_invalido";
      status=false;
    }

    if(usuarioNuevo['password'].length<6){ //verifico primer password minimo length 6
      status=false;
      var pw1 = document.getElementById("password");
      pw1.className += " campo_invalido";
      if(this.listaErrores.indexOf('*Contraseña mínimo 6 caracteres')==-1)
        this.listaErrores.push('*Contraseña mínimo 6 caracteres')
    }else{
      this.removeItemFromArr(this.listaErrores,'*Contraseña mínimo 6 caracteres')
    }
    
    if(document.getElementById("password2")['value'].length<6){
      var pw2 = document.getElementById("password2");
      pw2.className += " campo_invalido";
      console.log(this.listaErrores)
      if(this.listaErrores.indexOf('*Contraseña mínimo 6 caracteres')==-1)
          this.listaErrores.push('*Contraseña mínimo 6 caracteres')

    }else{
      this.removeItemFromArr(this.listaErrores,'*Contraseña mínimo 6 caracteres')
    }


    if(usuarioNuevo['password']!=document.getElementById("password2")['value']){
      status=false;
      var pw1 = document.getElementById("password");
      var pw2 = document.getElementById("password2");
      pw1.className += " campo_invalido";
      pw2.className += " campo_invalido";
      if(this.listaErrores.indexOf('*Contraseñas no coinciden')==-1)
        this.listaErrores.push('*Contraseñas no coinciden')

    }else{
      this.removeItemFromArr(this.listaErrores,'*Contraseñas no coinciden')
    }

    if(usuarioNuevo['telefono']==''){
      var elemento = document.getElementById("telefono");
      elemento.className += " campo_invalido";
      status=false;
    }

    if(usuarioNuevo['empresa']==''){
      var elemento = document.getElementById("empresa");
      elemento.className += " campo_invalido";
      status=false;
    }

    if(usuarioNuevo['linkedin']==''){
      var elemento = document.getElementById("linkedin");
      elemento.className += " campo_invalido";
      status=false;
    }

    if(!this.url){
      var elemento = document.getElementById("fotoPerfil");
      elemento.className += " campo_invalido";
      status=false;
    }

    return status;

  }

  validarEmail(valor) {
    var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  
    if (!regex.test(valor)) {
        return false;
    } else {
        return true;
    }
  }

  removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );
 
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
}

  actualizarEstadoRegistrar(){
    document.getElementById('btn_registrar')['value']='Registrando...';
    document.getElementById('btn_registrar').setAttribute('disabled', "true");
  }

  removerClaseInvalid(){
    var element1 = document.getElementById("name");
    var element2 = document.getElementById("alias");
    var element3 = document.getElementById("email");
    var element4 = document.getElementById("password");
    var element5 = document.getElementById("telefono");
    var element6 = document.getElementById("empresa");
    var element7 = document.getElementById("linkedin");
    var element8 = document.getElementById("password2");
    var element9 = document.getElementById("fotoPerfil");

   
    element1.classList.remove("campo_invalido");
    element2.classList.remove("campo_invalido");
    element3.classList.remove("campo_invalido");
    element4.classList.remove("campo_invalido");
    element5.classList.remove("campo_invalido");
    element6.classList.remove("campo_invalido");
    element7.classList.remove("campo_invalido");
    element8.classList.remove("campo_invalido");
    element9.classList.remove("campo_invalido");

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
                location.href='/login'
              })
            })

          }
        })


      })
    })

  }

}


