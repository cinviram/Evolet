import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

//servicios api
import {ApiUserService} from '../../service-api/api-user/api-user.service'
import {EventosPersonalizazdosService} from '../../service-api/eventos-personalizados/eventos-personalizazdos.service'

@Component({
  selector: 'app-modal-personalizados-asign',
  templateUrl: './modal-personalizados-asign.component.html',
  styleUrls: ['./modal-personalizados-asign.component.css']
})
export class ModalPersonalizadosAsignComponent implements OnInit {

  //obtengo el evento actualmente seleccionado
  eventoActual=[] //ojo está dentro de una lista
  
  listadoUsuariosRespaldo:any=[]
  listadoUsuarios:any=[]

  //listado de usuarios seleccionados para asignar
  listaAsignados:any=[]


  constructor(public bsModalRef: BsModalRef, public userService: ApiUserService,public eventCustomSrv: EventosPersonalizazdosService) { } 

  ngOnInit(): void {
    console.log(this.eventoActual)
    this.obtenerUsuarios()
  }

  obtenerUsuarios(){
    this.userService.obtenerUsuarios().subscribe(data=>{
      console.log(data)
      this.listadoUsuariosRespaldo=data;
      this.listadoUsuarios=data;
    })
  }

  buscarUsuarioCoincidencia(event){
    let palabra=event.target.value;
    console.log(palabra)

    let palabraMinus=palabra.toLowerCase();
    let coincidencias=[]

    for(let indice in this.listadoUsuariosRespaldo){
      let elemento=this.listadoUsuariosRespaldo[indice];
      let nombres=elemento.nombres;
      let nombresMinus=nombres.toLowerCase();

      if(nombresMinus.indexOf(palabraMinus)!=-1){
        coincidencias.push(elemento)
      }

    }

    this.listadoUsuarios=coincidencias
  }

  verificarAsignacion(event){
    //console.log(event)

    let check=event.target.checked;
    let idUser=event.target.id
    

    if(check){
      console.log('voy a asignar');
      for(let indice in this.listadoUsuariosRespaldo){
        let elemento=this.listadoUsuariosRespaldo[indice];
        if(elemento.idUser==idUser){
          this.listaAsignados.push(elemento.idUser); 
        }
      }

    }else{
      console.log('voy a quitar');
      let usuario=this.buscarUsuario(idUser);
      this.removeItemFromArr(this.listaAsignados,usuario.idUser);
      
    }

    console.log(this.listaAsignados)
  }

  asignarUsuariosEvento(){
    //armo objeto para enviar al api
    let objetoAsignacion={idEvento: this.eventoActual[0].idEvento,'listaIdUser': this.listaAsignados}
    console.log(objetoAsignacion)

    this.eventCustomSrv.asignarUsuariosEvento(objetoAsignacion).subscribe(data=>{
      console.log(data)

      if(data['exito']){
        Swal.fire(
          'Exito',
          'Usuarios asignados exitosamente',
          'success'
        ).then(response => {
          location.reload();
        })
      }
    })
  }

  removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );
 
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
  }

  //buscar usuario
  buscarUsuario(id){
    for(let indice in this.listadoUsuariosRespaldo){
      let usuario=this.listadoUsuariosRespaldo[indice];
      if(usuario.idUser==id){
        return usuario;
      }
    }
  }

}
