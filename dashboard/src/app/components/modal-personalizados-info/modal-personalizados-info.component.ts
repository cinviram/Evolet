import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

import {ApiEventoGeneralService} from '../../service-api/api-evento-general/api-evento-general.service'
import { EventosPersonalizazdosService} from '../../service-api/eventos-personalizados/eventos-personalizazdos.service'

@Component({
  selector: 'app-modal-personalizados-info',
  templateUrl: './modal-personalizados-info.component.html',
  styleUrls: ['./modal-personalizados-info.component.css']
})
export class ModalPersonalizadosInfoComponent implements OnInit {

  list:any[]=[] //El evento está en posicion 0, categorias unicas está en posicion 1
  lista_instructores:Object[]=[] //listado de instructores
  lista_usuarios:Object[]=[];
  statusDisabled=true
  nombreBtnEditar='Editar'

  constructor(public bsModalRef: BsModalRef,public ApiEventoGeneralService: ApiEventoGeneralService,
              public eventCustomSrv: EventosPersonalizazdosService) { }

  ngOnInit(): void {
    let arrayFecha=this.list[0].fechaLimite2[0].split('/')
    let fechaNueva=arrayFecha[2]+'-'+arrayFecha[1]+'-'+arrayFecha[0];
    let fechaLimiteFormat=fechaNueva+'T'+this.list[0].fechaLimite2[1];
    this.list[0]['fechaLimiteFormat']=fechaLimiteFormat
    
    this.cambiarSelectCategoria();

    //obtengo los instructores y actualizo el select de instructores
    this.ApiEventoGeneralService.obtenerInstructores().subscribe(data=>{
      let dataAny:any=data;
      console.log(data)
      this.lista_instructores=dataAny;
      
      this.cambiarSelectInstructor() //actualizo el seletor despues de 1 segundo

    })

    //obtengo los usuarios asociados a el evento actual
    console.log('id user asignados: ',this.list[0].usuarios)
    this.eventCustomSrv.obtenerinfoUser(JSON.stringify(this.list[0].usuarios)).subscribe(data=>{
      console.log(data)
      this.lista_usuarios=<any>data;

      for(let indice in this.lista_usuarios){
        this.cambiarSelectEstadoUser(this.lista_usuarios[indice]['idUser'],this.lista_usuarios[indice]['estado']);
      }

    })
    
  }

  cambiarSelectCategoria(){
    
    setTimeout(()=>{
      for(let indice in this.list[1]){
        let categoria=this.list[1][indice];
        if(categoria==this.list[0].categoria){
          let selector:any=document.getElementById("selectCategoria")
          selector.selectedIndex = indice;
        }
      }
    },1000)

    //asigno al campo el nombre del instructor actualmente asignado
    

  }

  cambiarSelectInstructor(){
    
    setTimeout(()=>{
      for(let indice in this.lista_instructores){
        let instructor:any=this.lista_instructores[indice];
        if(instructor.idInstructor==this.list[0].instructor){
          let selector:any=document.getElementById("selectInstructor")
          selector.selectedIndex = indice;
        }

      }
    },1000)

    //asigno al campo el nombre del instructor actualmente asignado
    

  }

  cambiarSelectEstadoUser(idUser,estado){
    let opciones=['Pendiente','Confirmado','Completado','Vencido','Anulado']
    let posicion=opciones.indexOf(estado)
    setTimeout(()=>{
      
      let selector:any=document.getElementById(`selectEstado-${idUser}`);
      selector.selectedIndex = posicion;
    
    
    },1000)

    //asigno al campo el nombre del instructor actualmente asignado
    

  }

  actualizarEvento(event){
    
    if(this.statusDisabled){ //si es true, entonces tiene disabled
      this.statusDisabled=false;
      this.nombreBtnEditar='Actualizar'; 
    
    }else{// ya tiene tiene actualizar y vamos a guardar en base la data actualizada
      this.cambiarTextoButton(); //deshabilitando el button y cambiando el texto
      //obteniendo el evento nuevo
      let dataUpdateEvento=this.obtenerEventoActualizado();
      console.log('evento actualizado: ',dataUpdateEvento)
      let data={'evento': dataUpdateEvento, idEvento: this.list[0].idEvento}
      this.eventCustomSrv.actualizarEvento(data).subscribe(result=>{
        console.log(result)
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

  actualizarEstadoUser(event){
    let idUser=event.target.id;
    let estado=document.getElementById(`selectEstado-${idUser}`)['value'];
    this.eventCustomSrv.actualizarEstadoUser({idUser: idUser,estado: estado,idEvento: this.list[0].idEvento}).subscribe(result=>{
      console.log(result)
      Swal.fire(
        'Exito',
        'Estado actualizado',
        'success'
      )
    })
  }

  eliminarUsuarioEvento(event){
    let idUser=event.target.id;
    let usuario=this.obtenerUsuario(idUser);
    
    let idEvento=this.list[0].idEvento;
    this.eventCustomSrv.eliminarUsuarioEvento({idUser: idUser,idEvento: idEvento}).subscribe(result=>{
      console.log(result)

      //eliminando del listado local
      this.removeItemFromArr(this.lista_usuarios,usuario);

      Swal.fire(
        'Exito',
        'Usuario eliminado',
        'success'
      )
    })
  }


  obtenerEventoActualizado(){
    let titulo=<any>document.getElementById('inputTitulo')['value'];
    let descripcion=<any>document.getElementById('inputDescripcion')['value'];
    let categoria=<any>document.getElementById('selectCategoria')['value'];
    let enlace=<any>document.getElementById('inputEnlace')['value'];
    let instructor=<any>document.getElementById('selectInstructor')['value'];
    let fechaLimite=<any>document.getElementById('inputFechaLimite')['value'];

    let eventoActualizado={titulo: titulo,descripcion: descripcion,categoria: categoria,enlace: enlace,
                            instructor: instructor, fechaLimite: fechaLimite
                          }

    return eventoActualizado


  }

  obtenerUsuario(id){
    for(let indice in this.lista_usuarios){
      let usuario=this.lista_usuarios[indice];
      if(usuario['idUser']==id){
        return usuario
      }
    }
  }

  removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );
 
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
  }

  cambiarTextoButton(){
    var uno = document.getElementById('btn_editar');
    uno.innerHTML='Actualizando ...'
    uno.setAttribute('disabled', "true");
  }

  //cerrar Modal
  cerrarModal(){
    location.reload();
    this.bsModalRef.hide()
  }

}
