import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
//Import - servicio
import { AuthService } from '../../auth/auth.service';
//Import API
import { ApiUserService } from '../../service-api/api-user/api-user.service';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public usuarioActual={};

  constructor(
    public AuthService: AuthService,
    public ApiUserService: ApiUserService
  ) { }

  ngOnInit(): void {
    let infoUser=localStorage.getItem('evolet-user');
    let objectoUser=JSON.parse(infoUser);
    this.usuarioActual=objectoUser;

    console.log(this.usuarioActual)

  }

  

}
