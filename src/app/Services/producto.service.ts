import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Producto } from '../Interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private urlapi = environment.endpoint + "Producto/";
  
  constructor(private http: HttpClient) { }

  lista(): Observable<ResponseApi> {
      return this.http.get<ResponseApi>(`${this.urlapi}Lista`);    
    }
  
  guardar(request: Producto): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlapi}Guardar`, request);
  }
  
  editar(request: Producto): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlapi}Editar`, request);
  }
  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlapi}Eliminar/${id}`);
  }
  
}
