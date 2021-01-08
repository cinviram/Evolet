import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiEventoGeneralService } from '../../service-api/api-evento-general/api-evento-general.service';

import { ModalEventosInfoComponent } from '../modal-eventos-info/modal-eventos-info.component';
import { ModalCrearEventoComponent } from '../modal-crear-evento/modal-crear-evento.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'


@Component({
  selector: 'app-agenda-general',
  templateUrl: './agenda-general.component.html',
  styleUrls: ['./agenda-general.component.css']
})
export class AgendaGeneralComponent implements OnInit {

  //Variable global
  eventos: any = []

  //referencia del modal
  bsModalRef: BsModalRef

  //Variable - constructor
  constructor(
    public AuthService: AuthService,
    public ApiEventoGeneralService: ApiEventoGeneralService,
    private bsModalService: BsModalService,
    private bsModalServiceCreacion: BsModalService

  ) { }

  ngOnInit(): void {
    this.ApiEventoGeneralService.obtenerEventos().subscribe(data => {
      //Asignacion a variable global (eventos)
      this.eventos = data;

      for(let indice in data){
        let objeto=data[indice];
        let  d=new Date(objeto.fechaLimite._seconds*1000); //transformo los segundos a DATE

        let fechaNueva=this.formatearFecha(d)
        objeto.fechaLimite2=fechaNueva;
      }
      console.log(this.eventos)
      
    })
  }

  eliminarEvento(event){
    console.log(event.target.id)
    this.ApiEventoGeneralService.eliminarEvento(event.target.id).subscribe(respuesta=>{
      console.log('Data del servidor: ',respuesta)
      if(respuesta['exito']){
        Swal.fire(
          'Éxito',
          'Evento eliminado',
          'success'
        ).then(response=>{
          location.reload();
        })
      }
    })
    
  }

   //buscar evento
   buscarEvento(id){
    for(let indice in this.eventos){
      let evento=this.eventos[indice];
      if(evento.idEvento==id){
        return evento;
      }
    }
  }

  crearEvento(event){
    //abrimos el modal 
    this.bsModalRef= this.bsModalService.show(ModalCrearEventoComponent)
  }
  

  //Enviar variable al modal
  verDetalle(event){
    console.log(event.target.id)
    let eventoEncontrado=this.buscarEvento(event.target.id);
    console.log('Evento seleccionado: ',eventoEncontrado)
    //abrimos el modal 
    const initialState:any = {
      list: [
        eventoEncontrado
      ]
  };
    this.bsModalRef= this.bsModalService.show(ModalEventosInfoComponent,{initialState})

  }


  formatearFecha(date) {
    console.log(date)

    let ano = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();

    if (mes <= 9) {
      mes = '0' + JSON.stringify(mes);
    } else {
      mes = JSON.stringify(mes);
    }

    if (dia <= 9) {
      dia = '0' + JSON.stringify(dia);
    } else {
      dia = JSON.stringify(dia);
    }

    let fechaNueva = dia + '/' + mes + '/' + JSON.stringify(ano);

    let hora = date.getHours();
    let minutos = date.getMinutes();

    if (hora <= 9) {
      hora = '0' + JSON.stringify(hora);
    } else {
      hora = JSON.stringify(hora);
    }

    if (minutos <= 9) {
      minutos = '0' + JSON.stringify(minutos);
    } else {
      minutos = JSON.stringify(minutos);
    }

    let horaNueva = hora + ':' + minutos

    return [fechaNueva, horaNueva]
  }

}
