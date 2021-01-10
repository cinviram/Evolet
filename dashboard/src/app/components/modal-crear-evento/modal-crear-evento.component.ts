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
  selector: 'app-modal-crear-evento',
  templateUrl: './modal-crear-evento.component.html',
  styleUrls: ['./modal-crear-evento.component.css']
})
export class ModalCrearEventoComponent implements OnInit {

  //url imagen perfil
  url;
  imgObject:any;
  
  lista_instructores:Object[]=[]

  //seccion firebase
  task: AngularFireUploadTask;

  constructor(
    public AuthService: AuthService,
    public ApiEventoGeneralService: ApiEventoGeneralService,
    public bsModalRef: BsModalRef,private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.ApiEventoGeneralService.obtenerInstructores().subscribe(data=>{
      let dataAny:any=data;
      console.log(data)
      this.lista_instructores=dataAny;

    })
  }

  crearEvento(){

    //validar primero
    this.cambiarTextoButton();
    let eventoNuevo = this.obtenerEventoNuevo();
    console.log(eventoNuevo)

    //funcion para subir foto de perfil primero a firebase
    this.uploadFile(this.imgObject, eventoNuevo); //dentro registro el evento
    
  }

  obtenerEventoNuevo() {
    var objectTitulo: any = document.getElementById("inputTitulo")
    var objectDescripcion: any = document.getElementById("inputDescripcion")
    var objectCosto: any = document.getElementById("inputCosto")
    var objectInstructor: any = document.getElementById("selectInstructor")
    var objectInscripcion: any = document.getElementById("inputInscripcion")
    var objectFechalimite: any = document.getElementById("inputFechaLimite")
    var objectEnlace: any = document.getElementById("inputEnlace");

    var titulo = objectTitulo.value
    var descripcion = objectDescripcion.value
    var costo = objectCosto.value
    var instructor = objectInstructor.value
    var imagen= ''
    var inscripcion = objectInscripcion.value
    var fechaLimite=objectFechalimite.value
    
    var enlace = objectEnlace.value

    //Evento nuevo
    let eventoNuevo = {'titulo': titulo, 'descripcion': descripcion, 'costo': costo, 
                      'instructor': instructor, 'inscripcion': inscripcion,'imagen': imagen,
                       'fechaCreacion': '',
                      'fechaLimite': fechaLimite, 'enlace': enlace }
    return eventoNuevo
  }

  readUrl(event:any) { 
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

        evento.imagen=rutaImgFirebase;

        console.log(evento)
        //registrando evento a la base 
        this.ApiEventoGeneralService.crearEvento(evento).subscribe(result => {
          console.log('respuesta: ', result)
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
        
        
      })
    })

  }

  cambiarTextoButton(){
    var uno = document.getElementById('btn_crear');
    uno.innerHTML='Creando ...'
    uno.setAttribute('disabled', "true");

  }


}
