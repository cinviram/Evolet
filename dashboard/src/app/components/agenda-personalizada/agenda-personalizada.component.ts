import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//Import - servicio
import { AuthService } from '../../auth/auth.service';
import {EventosPersonalizazdosService} from '../../service-api/eventos-personalizados/eventos-personalizazdos.service'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

import {ModalPersonalizadosCrearComponent} from '../../components/modal-personalizados-crear/modal-personalizados-crear.component'
import {ModalPersonalizadosAsignComponent} from '../modal-personalizados-asign/modal-personalizados-asign.component'
import { ModalPersonalizadosInfoComponent } from '../modal-personalizados-info/modal-personalizados-info.component';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-agenda-personalizada',
  templateUrl: './agenda-personalizada.component.html',
  styleUrls: ['./agenda-personalizada.component.css']
})
export class AgendaPersonalizadaComponent implements OnInit {

  //variables data
  eventosRespaldo=[]
  eventosData=[]

  categoriasUnicas=[]

  //referencia del modal
  bsModalRef: BsModalRef

  //Variable - constructor
  constructor(
    public AuthService: AuthService,
    public eventosSrv: EventosPersonalizazdosService,
    private bsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.eventosSrv.obtenerEventos().subscribe(data=>{
      console.log(data)
      this.eventosRespaldo=<any>data;
      this.eventosData=<any>data;

      for(let indice in this.eventosData){
        let objeto=data[indice];
        //obtengo solo la categoria para el combo box de filtrado
        let categoria=objeto.categoria;
        if(this.categoriasUnicas.indexOf(categoria)==-1){
          this.categoriasUnicas.push(categoria);
        }
        let  d=new Date(objeto.fechaLimite._seconds*1000); //transformo los segundos a DATE

        let fechaNueva=this.formatearFecha(d)
        objeto.fechaLimite2=fechaNueva;
      }

      console.log(this.categoriasUnicas)
    })
  }

  buscarEventoCoincidencia(event){
    let palabra=event.target.value;
    console.log(palabra)

    let palabraMinus=palabra.toLowerCase();
    let coincidencias=[]

    for(let indice in this.eventosRespaldo){
      let elemento=this.eventosRespaldo[indice];
      let nombre=elemento.titulo;
      let nombreMinus=nombre.toLowerCase();

      if(nombreMinus.indexOf(palabraMinus)!=-1){
        coincidencias.push(elemento)
      }

    }

    this.eventosData=coincidencias
  }

  filtrarCategoria(event){
   
    var objectTipo:any = document.getElementById("tipo_user")
    var cat= objectTipo.value
    
    let coincidencias=[];
    if(cat=='todos'){
      coincidencias=this.eventosRespaldo;
    }else{
      for(let indice in this.eventosRespaldo){
        let elemento=this.eventosRespaldo[indice];
        if(elemento['categoria']==cat){
          coincidencias.push(elemento);
        }
      }
    }
    
    this.eventosData=coincidencias
  }

  crearEvento(event){
    const initialState:any = {
      list: [
        this.categoriasUnicas,this.categoriasUnicas
      ]
    };
    //abrimos el modal 
    this.bsModalRef= this.bsModalService.show(ModalPersonalizadosCrearComponent,{initialState,
      ignoreBackdropClick: true,
      keyboard: false})
  }

  //asignar usuarios a eventos modal
  asignarUsuarioEvento(event){
    let idEvento=event.target.id;
    console.log(idEvento)

    let eventoSeleccionado=this.buscarEvento(idEvento);
    console.log(eventoSeleccionado)
    const initialState:any = {
      eventoActual: [
        eventoSeleccionado
      ]
    }
    //abrimos el modal 
    this.bsModalRef= this.bsModalService.show(ModalPersonalizadosAsignComponent,{initialState,
      ignoreBackdropClick: true,
      keyboard: false})
  }

  verDetalleEvento(event){
    let idEvento=event.target.id;
    
    //buscando evento asociado
    let evento=this.buscarEvento(idEvento);
    console.log(evento)

    const initialState:any = {
      list: [
        evento,this.categoriasUnicas
      ]
    };
    //abrimos el modal 
    
    this.bsModalRef= this.bsModalService.show(ModalPersonalizadosInfoComponent,{initialState,
      ignoreBackdropClick: true,
      keyboard: false, class: 'md-class'})
  }
  

  //buscar evento
  buscarEvento(id){
    for(let indice in this.eventosRespaldo){
      let evento=this.eventosRespaldo[indice];
      if(evento.idEvento==id){
        return evento;
      }
    }
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
