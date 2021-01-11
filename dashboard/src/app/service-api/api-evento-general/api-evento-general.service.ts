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
    return this.http.get(`https://us-central1-backend-evolet.cloudfunctions.net/us-central1/app/api/eventos/obtenerInstructores`); 
  }

  eliminarEvento(id){
    return this.http.delete('https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/eliminarEventosGeneral/'+id); 
  }

  actualizarEvento(evento){
    return this.http.put(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/eventos/actualizarEventoGeneral`,evento); 
  }

  crearEvento(evento){
    return this.http.post(`https://us-central1-backend-evolet.cloudfunctions.netapp/api/eventos/registrarEventoGeneral`,evento); 
  }
}
