import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiUserService } from '../../service-api/api-user/api-user.service';

//modales de usuario
import {ModalUserInfoComponent} from '../modal-user-info/modal-user-info.component';
import {ModalCrearUserComponent} from '../modal-crear-user/modal-crear-user.component'
import {BsModalService,BsModalRef } from 'ngx-bootstrap/modal'

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  //Variable global
  usuarios: any = []

  user:any={'id': '123', 'empresa': 'Cinermark'}


  //referencia del modal
  bsModalRef: BsModalRef

  //Variable - constructor
  constructor(
    public AuthService: AuthService,
    public ApiUserService: ApiUserService,
    private bsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.ApiUserService.obtenerUsuarios().subscribe(data => {
      //Asignacion a variable global (usuarios)
      this.usuarios=data;
      console.log(data)
    })
  }


  abrirModalUser(){
    console.log('click')
    //abrimos el modal de crear usuario
    this.bsModalRef= this.bsModalService.show(ModalCrearUserComponent)
  }

  //Enviar variable al modal
  verDetalle(event){
    console.log(event.target.id)
    let usuarioEncontrado=this.buscarUsuario(event.target.id);
    console.log('usuario seleccionado: ',usuarioEncontrado)

    //abrimos el modal 
    
    const initialState:any = {
      list: [
          usuarioEncontrado
      ]
  };
    this.bsModalRef= this.bsModalService.show(ModalUserInfoComponent,{initialState})

  }

  eliminarUsuario(event){
    console.log(event.target.id)
    this.ApiUserService.eliminarUsuario(event.target.id).subscribe(respuesta=>{
      console.log('data del servidor: ',respuesta)
      if(respuesta['exito']){
        Swal.fire(
          'Exito',
          'Usuario eliminado',
          'success'
        ).then(response=>{
          location.reload();
        })
      }
    })
  }
  
  //buscar usuario
  buscarUsuario(id){
    for(let indice in this.usuarios){
      let usuario=this.usuarios[indice];
      if(usuario.idUser==id){
        return usuario;
      }
    }
  }

}
