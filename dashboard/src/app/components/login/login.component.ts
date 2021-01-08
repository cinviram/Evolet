import { Component, OnInit } from '@angular/core';
//Import - servicio/
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Variable - constructor
  constructor(
    public AuthService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
