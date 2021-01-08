import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


//Import Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AgendaGeneralComponent } from './components/agenda-general/agenda-general.component';
import { ProfileComponent } from './components/profile/profile.component';

//Import de las rutas 
import { routing } from './app.routing';


//Imports Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

//Servicios
import { AuthService } from './auth/auth.service';


//Modulos necesarios para mostrar modales desde la dependencia ngx-bootstrap
import {AlertModule} from "ngx-bootstrap/alert";
import {ModalModule} from "ngx-bootstrap/modal";

//Modales dinámicos
import { ModalUserInfoComponent } from './components/modal-user-info/modal-user-info.component';
import { ModalEventosInfoComponent } from './components/modal-eventos-info/modal-eventos-info.component';
import { ModalCrearUserComponent } from './components/modal-crear-user/modal-crear-user.component';
import { ModalCrearEventoComponent } from './components/modal-crear-evento/modal-crear-evento.component';


// Variable configuración - Firebase
var config = {
  apiKey: "AIzaSyB_igUyMIQ1o9LKNq4IC8C2Kr8BwaHs7Rc",
  authDomain: "backend-evolet.firebaseapp.com",
  databaseURL: "https://backend-evolet.firebaseio.com",
  projectId: "backend-evolet",
  storageBucket: "backend-evolet.appspot.com",
  messagingSenderId: "425494682478"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    AgendaGeneralComponent,
    ProfileComponent,
    ModalUserInfoComponent,
    ModalEventosInfoComponent,
    ModalCrearUserComponent,
    ModalCrearEventoComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    routing,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    CommonModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
  ],
  providers: [AuthService],
  entryComponents: [ModalUserInfoComponent,ModalEventosInfoComponent,ModalCrearUserComponent,ModalCrearEventoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
