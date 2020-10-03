// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Recepcion } from 'src/app/models/recepcion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecepcionService extends CommonService<Recepcion, number> {
  protected API_URL: string = 'http://localhost:8080/api/recepciones/';
  constructor(protected http: HttpClient) {
    super(http);
  }

  buscarRecepcionesPorPedidos(id: number): Observable<number[]> {
    return this.http.get<number[]>(this.API_URL + 'por/' + id);
  }
}
