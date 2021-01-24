import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'

//Import - servicio
import { AuthService } from '../../auth/auth.service'; 
//Import API
import { ApiEventoGeneralService } from '../../service-api/api-evento-general/api-evento-general.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-modal-eventos-info',
  templateUrl: './modal-eventos-info.component.html',
  styleUrls: ['./modal-eventos-info.component.css']
})
export class ModalEventosInfoComponent implements OnInit {

  //variables de configuracion
  statusInput = true;
  name_button_edit = 'Editar';

  //List contiene la info del dash al modal
  list: any[] = [];
  eventoActual: any = {}
  eventoModificado: any = {}

   //url imagen perfil
   url;
   imgObject:any;
   banderaImg=false;
   
   lista_instructores:Object[]=[]
 
   //seccion firebase
   task: AngularFireUploadTask;

  //Variable - constructor
  constructor(
    public AuthService: AuthService,
    public ApiEventoGeneralService: ApiEventoGeneralService,
    public bsModalRef: BsModalRef,private storage: AngularFireStorage
  ) { }


  ngOnInit(): void {
    
    //Objeto con la info del evento
    this.eventoActual = this.list[0];
    //formateo la marca de tiempo a una fecha legible
    let tuplaFecha=this.formatearFecha(new Date(this.eventoActual['fechaLimite']._seconds*1000));
    let arrayFecha=tuplaFecha[0].split('/')
    tuplaFecha[0]=arrayFecha[2]+'-'+arrayFecha[1]+'-'+arrayFecha[0];
    let fechaLimiteFormat=tuplaFecha[0]+'T'+tuplaFecha[1]
    
    this.eventoActual['fechaLimiteFormat']=fechaLimiteFormat
    console.log('Evento actual: ', this.eventoActual)
    this.url=this.eventoActual.imgEvento;

    this.ApiEventoGeneralService.obtenerInstructores().subscribe(data=>{
      let dataAny:any=data;
      console.log(data)
      this.lista_instructores=dataAny;
      
      this.cambiarSelect() //actualizo el seletor despues de 1 segundo

    })

  }

  cambiarSelect(){

    setTimeout(()=>{
      for(let indice in this.lista_instructores){
        let elementInstructor=this.lista_instructores[indice];
        if(elementInstructor['idInstructor']==this.eventoActual.instructor){
          console.log('indice: ',indice)
          let selector:any=document.getElementById("selectInstructor")
          selector.selectedIndex = indice;
        }
      }
    },1000)

    //asigno al campo el nombre del instructor actualmente asignado
    

  }

  EditarEvento(event) {
    console.log(event.target.id)
    if (this.statusInput == true) {
      this.statusInput = false
      this.name_button_edit = 'Guardar'
    } else {
      console.log('Guardando...')
      let eventoActualizado = this.obtenerEventoActualizado();

      if(this.banderaImg){ //si la bandera ha cambiado a true es porque ha subido una imagen nueva
        //funcion para subir foto de perfil primero a firebase
        this.uploadFile(this.imgObject, eventoActualizado); //dentro registro el evento
      }else{
        //registrando evento a la base 
        this.ApiEventoGeneralService.actualizarEvento(eventoActualizado).subscribe(result => {
          console.log('respuesta: ', result)
          if (result['exito']) {
            Swal.fire(
              'Exito',
              'Evento actualizado',
              'success'
            ).then(response => {
              location.reload();
            })
          }
        })
      }
      

      

    }
  }

  obtenerEventoActualizado() {
    var objectTitulo: any = document.getElementById("titulo")
    var objectDescripcion: any = document.getElementById("descripcion")
    var objectCosto: any = document.getElementById("costo")
    var objectInstructor: any = document.getElementById("selectInstructor")
    var objectInscripcion: any = document.getElementById("inscripcion")
    var objectFechalimite: any = document.getElementById("fecha")
    var objectEnlace: any = document.getElementById("enlace")

    var titulo = objectTitulo.value
    var descripcion = objectDescripcion.value
    var costo = objectCosto.value
    var instructor = objectInstructor.value
    var inscripcion = objectInscripcion.value
    var fechaLimite = objectFechalimite.value
    var enlace = objectEnlace.value
    var imgEvento=this.eventoActual.imgEvento;

    //Eventoeditado
    let eventoModificado = { 'idEvento': this.eventoActual.idEvento, 'titulo': titulo, 'descripcion': descripcion,
                              'costo': costo, 'instructor': instructor, 'inscripcion': inscripcion, 
                              'fechaLimite': fechaLimite, 'enlace': enlace, 'imgEvento': imgEvento }
    console.log('Evento nuevo: ', eventoModificado)
    return eventoModificado
  }

  readUrl(event:any) { 

    if(this.banderaImg==false){ //primera vez que va a cambiar la imagen
      this.banderaImg=true; 
      console.log('ha subid una imagen')
    }

    if (event.target.files && event.target.files[0]) { 
      var reader = new FileReader(); 

      reader.onload = (event:any) => { 
      this.url = event.target.result; 
      } 

      reader.readAsDataURL(event.target.files[0]); 

      //imagen temporal
      let imagenUrl=event.target.files[0];
      console.log(imagenUrl)

      // Validation for Images Only
      if (imagenUrl.type.split('/')[0] !== 'image') { 
        console.error('unsupported file type :( ') 
        return;
      }
    
      this.imgObject=imagenUrl;
    } 
  }
  
  //Subir archivo a firebase
  uploadFile(file,evento) {
    
    // The storage path
    const path = `img_eventos/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Foto de los eventos generales' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    this.task.then(result=>{
      console.log('tarea completada ',result)
      let objectImg=fileRef.getDownloadURL()
      objectImg.subscribe(resp=>{
      let rutaImgFirebase=resp

        evento.imgEvento=rutaImgFirebase;

        console.log(evento)
        //registrando evento a la base 
        this.ApiEventoGeneralService.actualizarEvento(evento).subscribe(result => {
          console.log('respuesta: ', result)
          if (result['exito']) {
            Swal.fire(
              'Exito',
              'Evento actualizado',
              'success'
            ).then(response => {
              location.reload();
            })
          }
        })
        
        
      })
    })

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
