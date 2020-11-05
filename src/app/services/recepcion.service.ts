// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Recepcion } from 'src/app/models/recepcion';
import { Observable } from 'rxjs';
// Variable de Ambiente
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecepcionService extends CommonService<Recepcion, number> {
  // protected API_URL: string = 'http://localhost:8080/api/recepciones/';
  protected API_URL: string = `${environment.API_URL}/recepciones/`;
  constructor(protected http: HttpClient) {
    super(http);
  }

  buscarRecepcionesPorPedidos(id: number): Observable<Recepcion[]> {
    return this.http.get<Recepcion[]>(this.API_URL + 'porPedido/' + id);
  }
  buscarRecibidosPorOrden(id: number): Observable<number> {
    return this.http.get<number>(this.API_URL + 'recibidos/' + id);
  }
}
