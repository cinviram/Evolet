import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'

//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiEventoGeneralService } from '../../service-api/api-evento-general/api-evento-general.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-modal-eventos-info',
  templateUrl: './modal-eventos-info.component.html',
  styleUrls: ['./modal-eventos-info.component.css']
})
export class ModalEventosInfoComponent implements OnInit {

  //variables de configuracion
  statusInput = true;
  name_button_edit = 'Editar'

  //List contiene la info del dash al modal
  list: any[] = [];
  eventoActual: any = {}
  eventoModificado: any = {}

  //Variable - constructor
  constructor(
    public AuthService: AuthService,
    public ApiEventoGeneralService: ApiEventoGeneralService,
    public bsModalRef: BsModalRef,
  ) { }


  ngOnInit(): void {
    //Objeto con la info del evento
    this.eventoActual = this.list[0];
    console.log('Evento actual: ', this.eventoActual)
  }

  EditarEvento(event) {
    console.log(event.target.id)
    if (this.statusInput == true) {
      this.statusInput = false
      this.name_button_edit = 'Guardar'
    } else {
      console.log('Guardando...')
      console.log(this.eventoActual)
      let eventoActualizado = this.obtenerEventoActualizado();

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


  obtenerEventoActualizado() {
    var objectTitulo: any = document.getElementById("titulo")
    var objectDescripcion: any = document.getElementById("descripcion")
    var objectCosto: any = document.getElementById("costo")
    var objectInstructor: any = document.getElementById("instructor")
    var objectInscripcion: any = document.getElementById("inscripcion")
    var objectFechalimite: any = document.getElementById("fecha")
    var objectEnlace: any = document.getElementById("enlace")

    var titulo = objectTitulo.value
    var descripcion = objectDescripcion.value
    var costo = objectCosto.value
    var instructor = objectInstructor.value
    var inscripcion = objectInscripcion.value
    var fecha = objectFechalimite.value
    var enlace = objectEnlace.value

    //Eventoeditado
    let eventoModificado = { 'idEvento': this.eventoActual.idEvento, 'titulo': titulo, 'descripcion': descripcion, 'costo': costo, 'instructor': instructor, 'inscripcion': inscripcion, 'fecha': "1998-07-03", 'enlace': enlace }
    console.log('Evento nuevo: ', eventoModificado)
    return eventoModificado
  }

}
