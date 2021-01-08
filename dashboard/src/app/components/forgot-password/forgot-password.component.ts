import { Component, OnInit } from '@angular/core';
//Import - servicio
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  //Variable - constructor
  constructor(
    public AuthService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
