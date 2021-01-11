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
} 
