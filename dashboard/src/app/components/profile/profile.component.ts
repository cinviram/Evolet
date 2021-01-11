import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiUserService } from '../../service-api/api-user/api-user.service';

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

  constructor(
    public AuthService: AuthService,
    public ApiUserService: ApiUserService
  ) { }

  ngOnInit(): void {
    let infoUser = localStorage.getItem('evolet-user');
    let objectoUser = JSON.parse(infoUser);
    this.usuarioActual = objectoUser;

    console.log(this.usuarioActual)

  }

  EditarAdministrador(event) {
    console.log(event.target.id)
    if (this.statusInput == true) {
      this.statusInput = false
      this.name_button_edit = 'Guardar'
    } else {
      console.log('Guardando...')
      this.cambiarTextoButton();
      //console.log(this.usuarioActual)
      let usuarioActualizado = this.obtenerAdminActualizado();
      console.log(usuarioActualizado)
      /* this.ApiUserService.actualizarUsuario(usuarioActualizado).subscribe(result=>{
        console.log('respuesta: ',result)
        if(result['exito']){
          Swal.fire(
            'Exito',
            'Administrador actualizado',
            'success'
          ).then(response=>{
            location.reload();
          })
        }
      }) */
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

    var nombres= objectNombre.value
    var correo=  objectCorreo.value
    var celular= objectCelular.value
    var alias= objectAlias.value
    var sexo= objectSexo.value
    var fecha= objectFecha.value
    var empresa= objectEmpresa.value
    var linkedin= objectLinkedin.value

    //Admin editado
    let usuarioModificado={'idUser': this.usuarioActual.id,'nombres': nombres, 'correo':correo, 'celular':celular, 'alias':alias, 'sexo':sexo,'fecha':fecha,'empresa':empresa,'linkedin':linkedin}
    console.log('Admin nuevo: ',usuarioModificado)
    return usuarioModificado
  }


  cambiarTextoButton() {
    var uno = document.getElementById('btn_editar');
    uno.innerHTML = 'Actualizando ...'
    uno.setAttribute('disabled', "true");

  }



}
