import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-personalizados-asign',
  templateUrl: './modal-personalizados-asign.component.html',
  styleUrls: ['./modal-personalizados-asign.component.css']
})
export class ModalPersonalizadosAsignComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { } 

  ngOnInit(): void {
  }

}
