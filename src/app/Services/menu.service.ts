import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlapi = environment.endpoint + "Menu/";
  
  constructor(private http: HttpClient) { }
  
    lista(idUsuario: number): Observable<ResponseApi> {
      return this.http.get<ResponseApi>(`${this.urlapi}Lista?idUsuario=${idUsuario}`);
    }
}
