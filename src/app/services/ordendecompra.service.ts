// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { OrdenDeCompra } from 'src/app/models/ordendecompra';
import { Observable } from 'rxjs';
// Enviroment
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdendecompraService extends CommonService<OrdenDeCompra, number> {
  // protected API_URL: string = 'http://localhost:8080/api/ordenes/';
  protected API_URL: string = `${environment.API_URL}/ordenes/`;
  constructor(protected http: HttpClient) {
    super(http);
  }
  buscarOrdenesPorRequisiciones(id: number): Observable<number[]> {
    return this.http.get<number[]>(this.API_URL + 'por/' + id);
  }
}
