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
  estadoClick=false;
  inputValor='Enviar'
  mantenerRegistro=true;
  constructor(
    public AuthService: AuthService
  ) { }

  ngOnInit(): void {
  }

  enviarCorreo(email){
    if(email!=''){
      this.estadoClick=true;
      this.inputValor='Enviado ...'
      this.AuthService.ForgotPassword(email).then(data=>{
        console.log(data);
        window.alert('Correo enviado, revise su bandeja de entrada');
        location.href='/login'
      });
    }else{
      window.alert('Email Vacio')
    }
    
    
  }

}
