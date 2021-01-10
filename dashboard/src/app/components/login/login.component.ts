import { Component, OnInit } from '@angular/core';
//Import - servicio/
import { AuthService } from '../../auth/auth.service';

import {ApiUserService} from '../../service-api/api-user/api-user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Variable - constructor
  constructor(
    public AuthService: AuthService,public usuarioService: ApiUserService
  ) { }

  ngOnInit(): void {
  }

  iniciarSesion(correo,password){
    this.AuthService.SignIn(correo, password).then(data=>{ //me logeo con firebase
      //logeo exitoso
      console.log(correo)
      this.usuarioService.obtenerAdministrador(correo).subscribe(dataAdmin=>{
        console.log(dataAdmin)
        let result:any=dataAdmin;
        if(result['exito']){

          //guardamos la persistencia
          let objetoUser=JSON.stringify(dataAdmin['exito'][0]);
          localStorage.setItem('evolet-user',objetoUser);
        }


      })

    })
  }




}
