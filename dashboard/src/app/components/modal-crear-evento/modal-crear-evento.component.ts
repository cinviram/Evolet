import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'

//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiEventoGeneralService } from '../../service-api/api-evento-general/api-evento-general.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-modal-crear-evento',
  templateUrl: './modal-crear-evento.component.html',
  styleUrls: ['./modal-crear-evento.component.css']
})
export class ModalCrearEventoComponent implements OnInit {
  eventoActual: any = {}
  eventoNuevo: any = {}

  constructor(
    public AuthService: AuthService,
    public ApiEventoGeneralService: ApiEventoGeneralService,
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  crearEvento(){
    let eventoNuevo = this.obtenerEventoNuevo();
    this.ApiEventoGeneralService.crearEvento(eventoNuevo).subscribe(result => {
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
  }

  obtenerEventoNuevo() {
    var objectTitulo: any = document.getElementById("titulo")
    var objectDescripcion: any = document.getElementById("descripcion")
    var objectCosto: any = document.getElementById("costo")
    var objectInstructor: any = document.getElementById("instructor")
    var objectInscripcion: any = document.getElementById("inscripcion")
    var objectFechacreacion: any = document.getElementById("fecha_creacion")
    var objectFechalimite: any = document.getElementById("fecha_limite")
    var objectEnlace: any = document.getElementById("enlace")

    var titulo = objectTitulo.value
    var descripcion = objectDescripcion.value
    var costo = objectCosto.value
    var instructor = objectInstructor.value
    var inscripcion = objectInscripcion.value
    var fechaCreacion=objectFechacreacion.value
    var fechaLimite = objectFechalimite.value
    var enlace = objectEnlace.value

    //Evento nuevo
    let eventoNuevo = {'titulo': titulo, 'descripcion': descripcion, 'costo': costo, 'instructor': instructor, 'inscripcion': inscripcion, 'fechaCreacion': "1998-07-03", 'fechaLimite': "1998-07-03", 'enlace': enlace }
    console.log('Evento creado: ', eventoNuevo)
    return eventoNuevo
  }

}
