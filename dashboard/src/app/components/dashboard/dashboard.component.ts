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
  usuariosRespado:any=[]

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
      this.usuariosRespado=data;
      this.usuarios=data;
      console.log(data)
    })
  }


  abrirModalUser(){
    console.log('click')
    //abrimos el modal de crear usuario
    this.bsModalRef= this.bsModalService.show(ModalCrearUserComponent,{ignoreBackdropClick: true,})
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
    this.bsModalRef= this.bsModalService.show(ModalUserInfoComponent,{initialState,ignoreBackdropClick: true,})

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

  cambioTipo(event){
   
    var objectTipo:any = document.getElementById("tipo_user")
    var tipo= objectTipo.value
    
    let coincidencias=[];
    if(tipo=='todos'){
      coincidencias=this.usuariosRespado;
    }else{
      for(let indice in this.usuariosRespado){
        let elemento=this.usuariosRespado[indice];
        if(elemento['tipoUsuario']==tipo){
          coincidencias.push(elemento);
        }
      }
    }
    
    this.usuarios=coincidencias
  }

  buscarUsuarioCoincidencia(event){
    let palabra=event.target.value;
    console.log(palabra)

    let palabraMinus=palabra.toLowerCase();
    let coincidencias=[]

    for(let indice in this.usuariosRespado){
      let elemento=this.usuariosRespado[indice];
      let nombres=elemento.nombres;
      let nombresMinus=nombres.toLowerCase();

      if(nombresMinus.indexOf(palabraMinus)!=-1){
        coincidencias.push(elemento)
      }

    }

    this.usuarios=coincidencias
  }

}
