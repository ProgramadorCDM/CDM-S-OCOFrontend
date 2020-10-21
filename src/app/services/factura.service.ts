// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Factura } from 'src/app/models/factura';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturaService extends CommonService<Factura, number> {
  protected API_URL: string = 'http://localhost:8080/api/facturas/';
  constructor(protected http: HttpClient) {
    super(http);
  }

  obtenerFacturasPorOrden(idOrden: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.API_URL + 'orden/' + idOrden);
  }
}
