import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventosPersonalizazdosService {

  constructor(private http: HttpClient) { }

  obtenerEventos(){
    return this.http.get(`http://localhost:5000/backend-evolet/us-central1/app/api/eventos/obtenerEventosAgenda`); 
  }

  crearEventoAgenda(evento){
    return this.http.post(`http://localhost:5000/backend-evolet/us-central1/app/api/eventos/registrarEventosAgenda`,evento); 
  }

  asignarUsuariosEvento(asignacion){
    return this.http.post(`http://localhost:5000/backend-evolet/us-central1/app/api/eventos/registrarAsignacionAgenda`,asignacion); 
  }
} 
