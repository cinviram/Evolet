import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//Import - servicio
import { AuthService } from '../../auth/auth.service';
import { ModalEventosInfoComponent } from '../modal-eventos-info/modal-eventos-info.component';
import { ModalCrearEventoComponent } from '../modal-crear-evento/modal-crear-evento.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-agenda-personalizada',
  templateUrl: './agenda-personalizada.component.html',
  styleUrls: ['./agenda-personalizada.component.css']
})
export class AgendaPersonalizadaComponent implements OnInit {

  //Variable - constructor
  constructor(
    public AuthService: AuthService,
  ) { }

  ngOnInit(): void {
  }

}
