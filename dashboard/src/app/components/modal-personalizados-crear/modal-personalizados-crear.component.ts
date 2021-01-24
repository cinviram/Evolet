import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {EventosPersonalizazdosService} from '../../service-api/eventos-personalizados/eventos-personalizazdos.service'
import { ApiEventoGeneralService } from '../../service-api/api-evento-general/api-evento-general.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modal-personalizados-crear',
  templateUrl: './modal-personalizados-crear.component.html',
  styleUrls: ['./modal-personalizados-crear.component.css']
})
export class ModalPersonalizadosCrearComponent implements OnInit {

  lista_instructores:Object[]=[]
  //List contiene la info del dash al modal para las categorias unicas
  list= [];

  //control de selector categoria
  banderaSelector=false;

  constructor(public bsModalRef: BsModalRef, public eventCustomSrv: EventosPersonalizazdosService,
              public ApiEventoGeneralService: ApiEventoGeneralService
    ) { }

  ngOnInit(): void {

    this.updateSelect()
    
    this.ApiEventoGeneralService.obtenerInstructores().subscribe(data=>{
      let dataAny:any=data;
      console.log(data)
      this.lista_instructores=dataAny;

    })
  }

  crearEvento(){

    let eventoNuevo = this.obtenerEventoNuevo();
    //validando el evento
    let resultado=this.validarEvento(eventoNuevo);

    if(resultado){
      this.cambiarTextoButton();
      this.eventCustomSrv.crearEventoAgenda(eventoNuevo).subscribe(result=>{
        console.log(result)
  
        if (result['exito']) {
          Swal.fire(
            'Exito',
            'Evento creado',
            'success'
          ).then(response => {
            location.reload();
          })
        }
      })
    }else{
      console.log('evento no valido')
    }

  }

  obtenerEventoNuevo() {
    var objectTitulo: any = document.getElementById("inputTitulo")
    var objectDescripcion: any = document.getElementById("inputDescripcion")
    var objectCategoria: any = document.getElementById("selectCategoria")
    var objectInstructor: any = document.getElementById("selectInstructor")
    var objectFechalimite: any = document.getElementById("inputFechaLimite")
    var objectEnlace: any = document.getElementById("inputEnlace");

    var titulo = objectTitulo.value
    var descripcion = objectDescripcion.value
    var categoria = objectCategoria.value
    var instructor = objectInstructor.value
    var fechaLimite=objectFechalimite.value
    var enlace = objectEnlace.value

    if(categoria=='nuevaCat'){
      var objectNuevaCat:any=document.getElementById('inputNuevaCat');
      categoria=objectNuevaCat.value;
    }

    //Evento nuevo
    let eventoNuevo = {'titulo': titulo, 'descripcion': descripcion, 'categoria': categoria, 
                      'instructor': instructor,'fechaCreacion': '',
                      'fechaLimite': fechaLimite, 'enlace': enlace }
    return eventoNuevo
  }

  cambioSelector(){
    let objetoSelector:any=document.getElementById('selectCategoria');
    console.log(objetoSelector.value)

    if(objetoSelector.value=='nuevaCat'){
      this.banderaSelector=true;
    }else{
      this.banderaSelector=false;
    }
  }

  updateSelect(){

    setTimeout(()=>{
      
      let selector:any=document.getElementById("selectCategoria")
        selector.selectedIndex = 0;
    },1000)

    //asigno al campo el nombre del instructor actualmente asignado
    

  }

  removerClaseInvalid(){
    var element1 = document.getElementById("inputTitulo");
    var element2 = document.getElementById("inputDescripcion");
    //var element3 = document.getElementById("selectCategoria");
    //var element4 = document.getElementById("inputNuevaCat");
    var element5 = document.getElementById("inputEnlace");
    var element6 = document.getElementById("selectInstructor");
    var element7 = document.getElementById("inputFechaLimite");
    
   
    element1.classList.remove("is-invalid");
    element2.classList.remove("is-invalid");
    //element3.classList.remove("is-invalid");
    //element4.classList.remove("is-invalid");
    element5.classList.remove("is-invalid");
    element6.classList.remove("is-invalid");
    element7.classList.remove("is-invalid");
  
  }

  //funciones de validacion
  validarEvento(evento){

    this.removerClaseInvalid()
    
    let status=true; //asumo que el evento es valido

    if(evento['titulo']==''){
      var elemento = document.getElementById("inputTitulo");
      elemento.className += " is-invalid";
      status=false;
    }

    if(evento['descripcion']==''){
      var elemento = document.getElementById("inputDescripcion");
      elemento.className += " is-invalid";
      status=false;
    }


    if(evento['categoria']=="Elegir Categoría"){
      var elemento = document.getElementById("selectCategoria");
      elemento.className += " is-invalid";
      status=false;
    }else{
      var inputNuevaCat = document.getElementById("selectCategoria")['value'];
      
      if(inputNuevaCat=='nuevaCat'){
        if(evento['categoria']==''){
          var elemento = document.getElementById("inputNuevaCat");
          elemento.className += " is-invalid";
          status=false;
        }
      }

    }


    if(evento['enlace']==''){
      var elemento = document.getElementById("inputEnlace");
      elemento.className += " is-invalid";
      status=false;
    }

    if(evento['fechaLimite']==''){
      var elemento = document.getElementById("inputFechaLimite");
      elemento.className += " is-invalid";
      status=false;
    } 

    return status
  }

  cambiarTextoButton(){
    var uno = document.getElementById('btn_crear');
    uno.innerHTML='Creando ...'
    uno.setAttribute('disabled', "true");

  }

}
