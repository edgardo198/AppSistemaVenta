import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private urlapi = environment.endpoint + "Rol/";

  constructor(private http: HttpClient) { }

  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlapi}Lista`);
  }
  
}
