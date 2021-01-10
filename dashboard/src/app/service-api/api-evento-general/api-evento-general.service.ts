import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiEventoGeneralService {
  constructor(private http: HttpClient) { }
  
  //Metodos de la clase 
  obtenerEventos(){
    return this.http.get(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/obtenerEventosGeneral`); 
  }

  obtenerInstructores(){
    return this.http.get(`http://localhost:5000/backend-evolet/us-central1/app/api/eventos/obtenerInstructores`); 
  }

  eliminarEvento(id){
    return this.http.delete('https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/eliminarEventosGeneral/'+id); 
  }

  actualizarEvento(evento){
    return this.http.put(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/actualizarEventoGeneral`,evento); 
  }

  crearEvento(evento){
    return this.http.post(`http://localhost:5000/backend-evolet/us-central1/app/api/eventos/registrarEventoGeneral`,evento); 
  }
}
