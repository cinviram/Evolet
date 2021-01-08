import { Injectable } from '@angular/core';

//Importación para API
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {
  constructor(private http: HttpClient) { }

  //Metodos de la clase 
  obtenerUsuarios(){
    return this.http.get(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/user/obtenerUsuariosTodos`); 
  }

  crearUsuario(user){
    return this.http.post(`http://localhost:5000/backend-evolet/us-central1/app/api/user/crearUsuario`,user); 
  }

  actualizarUsuario(user){
    return this.http.put(`https://us-central1-backend-evolet.cloudfunctions.net/app/api/user/actualizarusuario`,user); 
  }

  eliminarUsuario(id){
    return this.http.delete('https://us-central1-backend-evolet.cloudfunctions.net/app/api/user/eliminarUsuario/'+id); 
  }
}

