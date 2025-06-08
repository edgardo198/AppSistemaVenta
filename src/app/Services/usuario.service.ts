import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { Usuario } from '../Interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlapi = environment.endpoint + "Usuario/";


  constructor(private http: HttpClient) { }

  inciarSecion(request: Login): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlapi}IniciarSesion`, request);
  }

  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlapi}Lista`);    
  }

  guardar(request: Usuario): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlapi}Guardar`, request);
  }

  editar(request: Usuario): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlapi}Editar`, request);
  }
  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlapi}Eliminar/${id}`);
  }
}
