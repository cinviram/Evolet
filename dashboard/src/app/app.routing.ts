import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AgendaGeneralComponent } from './components/agenda-general/agenda-general.component';
import { ProfileComponent } from './components/profile/profile.component';



//Variable para asignar las rutas en la web
//path match porque la ruta debe coincidir en su totalidad
const appRoutes = [
    { path: 'login', component: LoginComponent,  pathMatch: 'full'},
    { path: 'register', component: RegisterComponent,  pathMatch: 'full'},
    { path: 'dashboard', component: DashboardComponent,  pathMatch: 'full'},
    { path: 'forgot-password', component: ForgotPasswordComponent,pathMatch: 'full'},
    { path: 'agenda-general', component: AgendaGeneralComponent,pathMatch: 'full'},
    { path: 'profile', component: ProfileComponent,pathMatch: 'full'},
  ];

export const routing = RouterModule.forRoot(appRoutes);