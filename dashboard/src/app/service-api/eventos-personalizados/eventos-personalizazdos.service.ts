import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventosPersonalizazdosService {

  constructor(private http: HttpClient) { }

  obtenerEventos(){
    return this.http.get(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/obtenerEventosAgenda`); 
  }

  obtenerinfoUser(idUsers){
    return this.http.get(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/obtenerDataUserId/${idUsers}`); 
  }

  crearEventoAgenda(evento){
    return this.http.post(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/registrarEventosAgenda`,evento); 
  }

  asignarUsuariosEvento(asignacion){
    return this.http.post(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/registrarAsignacionAgenda`,asignacion); 
  }

  actualizarEvento(dataEvento){ //envio el evento y el id
    return this.http.put(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/actualizarEventoAgenda`,dataEvento); 
  }

  actualizarEstadoUser(dataUser){ //envio el evento y el id
    return this.http.put(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/actualizarEstadoUsuario`,dataUser); 
  }

  eliminarUsuarioEvento(dataUser){ //envio el evento y el id
    return this.http.put(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/eliminarUsuarioEvento`,dataUser); 
  }

  
} 
