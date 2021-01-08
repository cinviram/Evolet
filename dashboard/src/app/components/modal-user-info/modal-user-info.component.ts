import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'

//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiUserService } from '../../service-api/api-user/api-user.service';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-modal-user-info',
  templateUrl: './modal-user-info.component.html',
  styleUrls: ['./modal-user-info.component.css']
})
export class ModalUserInfoComponent implements OnInit {

  //variables de configuracion
  statusInput=true;
  name_button_edit='Editar'


  //Modelo de usuario
  nombres: string;
  correo: string;

  //List contiene la info del dash al modal
  list: any[] = [];
  usuarioActual:any={}
  usuarioModificado:any={}

  //Variable - constructor
  constructor(
    public AuthService: AuthService,
    public ApiUserService: ApiUserService,
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    
    //Objeto con la info del user
    this.usuarioActual=this.list[0];
    console.log('usuario actual: ',this.usuarioActual)

  }

  EditarUser(event){
    console.log(event.target.id)
    if(this.statusInput==true){
      this.statusInput=false
      this.name_button_edit='Guardar'
    }else{
      console.log('Guardando...')
      console.log(this.usuarioActual)
      let usuarioActualizado=this.obtenerUsuarioActualizado();
      this.ApiUserService.actualizarUsuario(usuarioActualizado).subscribe(result=>{
        console.log('respuesta: ',result)
        if(result['exito']){
          Swal.fire(
            'Exito',
            'Usuario actualizado',
            'success'
          ).then(response=>{
            location.reload();
          })
        }
      })

    }
  }


  obtenerUsuarioActualizado(){
    var objectNombre:any = document.getElementById("nombres")
    var objectCorreo:any = document.getElementById("correo")
    var objectCelular:any = document.getElementById("celular")
    var objectAlias:any = document.getElementById("alias")
    var objectSexo:any = document.getElementById("sexo")
    var objectFecha:any = document.getElementById("fec_nac")
    var objectTipo:any = document.getElementById("tipo_user")
    var objectEmpresa:any = document.getElementById("empresa")
    var objectCargo:any = document.getElementById("cargo")

    var nombres= objectNombre.value
    var correo=  objectCorreo.value
    var celular= objectCelular.value
    var alias= objectAlias.value
    var sexo= objectSexo.value
    var fecha= objectFecha.value
    var tipo= objectTipo.value
    var empresa= objectEmpresa.value
    var cargo= objectCargo.value

    //Usuario editado
    let usuarioModificado={'idUser': this.usuarioActual.idUser,'nombres': nombres, 'correo':correo, 'celular':celular, 'alias':alias, 'sexo':sexo,'fecha':"1998-07-03",'tipo':tipo,'empresa':empresa,'cargo':cargo}
    console.log('nombre nuevo: ',usuarioModificado)

    return usuarioModificado
  }

}
