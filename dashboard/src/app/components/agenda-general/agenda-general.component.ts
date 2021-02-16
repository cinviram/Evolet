import { Component, OnInit } from '@angular/core';

//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiEventoGeneralService } from '../../service-api/api-evento-general/api-evento-general.service';

import { ModalEventosInfoComponent } from '../modal-eventos-info/modal-eventos-info.component';
import { ModalCrearEventoComponent } from '../modal-crear-evento/modal-crear-evento.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs;      

@Component({
  selector: 'app-agenda-general',
  templateUrl: './agenda-general.component.html',
  styleUrls: ['./agenda-general.component.css']
})
export class AgendaGeneralComponent implements OnInit {

  //Variable global
  eventos: any = []
  eventosRespaldo:any=[]

  //referencia del modal
  bsModalRef: BsModalRef

  //Variable - constructor
  constructor(
    public AuthService: AuthService,
    public ApiEventoGeneralService: ApiEventoGeneralService,
    private bsModalService: BsModalService,

  ) {
    
   }

  ngOnInit(): void {
    this.ApiEventoGeneralService.obtenerEventos().subscribe(data => {
      //Asignacion a variable global (eventos)
      this.eventosRespaldo=data;
      this.eventos = data;

      console.log(this.eventos)

      for(let indice in data){
        let objeto=data[indice];
        let  d=new Date(objeto.fechaLimite._seconds*1000); //transformo los segundos a DATE

        let fechaNueva=this.formatearFecha(d)
        objeto.fechaLimite2=fechaNueva;
      }
      console.log(this.eventos)
      
    })
  }

  generatePDF() {  

    var date = new Date();
    
    let docDefinition = {  
      content: [
        {  
          text: 'REPORTE DE EVENTOS GENERALES',  
          fontSize: 16,  
          alignment: 'center',  
          color: '#007bff',
          bold: true
        },
        {  
          text: 'Evolet',  
          fontSize: 14,  
          alignment: 'center',  
          color: '#007bff',
          bold: false,
          margin: [0, 10,0,5]
        },
        {  
          text: `Fecha: ${date.getDate() + "/" + (date.getMonth() +1) + "/" + date.getFullYear()}`,  
          fontSize: 14,  
          alignment: 'center',  
          color: '#007bff',
          bold: false,
          margin: [0, 5,0,40]
        } , 
        
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: '2%',
              text: '#',
              style: [ 'cabecera' ],
              
            },
            {
              // auto-sized columns have their widths based on their content
              width: '40%',
              text: 'Titulo',
              style: [ 'cabecera' ]
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: 'Fecha',
              style: [ 'cabecera' ]
            },
            {
              // fixed width
              width: '*',
              text: 'Hora',
              style: [ 'cabecera' ]
            },
            {
              // percentage width
              width: '*',
              text: 'Instructor',
              style: [ 'cabecera' ]
            },
            {
              // percentage width
              width: '*',
              text: 'Costo',
              style: [ 'cabecera' ]
            }
          ],
          // optional space between columns
          columnGap: 10
        },
        
       
      ],
      styles: {
        cabecera: {
          fontSize: 12,
          bold: true,
        },
        cuerpo: {
          italic: true,
          alignment: 'left',
          margin: [0, 5],
        }
      }
    }; 
    
    console.log(this.eventosRespaldo.length)
    for(let i=0;i<this.eventosRespaldo.length;i+=1){
      let evento=this.eventosRespaldo[i];

      let fila={
        columns: [
          {
            // auto-sized columns have their widths based on their content
            width: '2%',
            text: i+1,
            style: [ 'cuerpo' ],
            
          },
          {
            // auto-sized columns have their widths based on their content
            width: '40%',
            text: evento.titulo,
            style: [ 'cuerpo' ]
          },
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            width: '*',
            text: evento.fechaLimite2[0],
            style: [ 'cuerpo' ]
          },
          {
            // fixed width
            width: '*',
            text: evento.fechaLimite2[1],
            style: [ 'cuerpo' ]
          },
          {
            // percentage width
            width: '*',
            text: evento.nombreInstructor,
            style: [ 'cuerpo' ]
          },
          {
            // percentage width
            width: '*',
            text: evento.costo,
            style: [ 'cuerpo' ]
          }
        ],
        // optional space between columns
        columnGap: 10
      }
      
      console.log(fila)
      docDefinition.content.push(fila);

    }
    
    pdfMake.createPdf(docDefinition).open();  
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

    this.eventos=coincidencias
  }

  crearEvento(event){
    //abrimos el modal 
    this.bsModalRef= this.bsModalService.show(ModalCrearEventoComponent,{
      ignoreBackdropClick: true,
      keyboard: false})
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
    this.bsModalRef= this.bsModalService.show(ModalEventosInfoComponent,{initialState,ignoreBackdropClick: true,
      keyboard: false})

  }


  formatearFecha(date) {
    
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
