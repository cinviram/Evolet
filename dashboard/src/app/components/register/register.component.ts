import { Component, OnInit } from '@angular/core';
//Import - servicio
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //Variable - constructor
  constructor(
    public AuthService: AuthService
  ) { }

  ngOnInit(): void {
  }

}


