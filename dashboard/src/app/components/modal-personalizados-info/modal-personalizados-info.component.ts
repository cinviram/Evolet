import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

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
    this.eventCustomSrv.obtenerinfoUser(JSON.stringify(this.list[0].usuarios)).subscribe(data=>{
      console.log(data)
      this.lista_usuarios=<any>data;
    })
    
  }

  cambiarSelectCategoria(){
    
    setTimeout(()=>{
      console.log('hola2')
      for(let indice in this.list[1]){
        let categoria=this.list[1][indice];
        console.log(categoria)
        if(categoria==this.list[0].categoria){
          console.log('indice: ',indice)
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

}
