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

  saveFile(factura: Factura, archivo: File): Observable<Factura> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('formato', 'pdf');
    formData.append('nombrearchivo', archivo.name);
    formData.append('fechaderegistro', null);
    formData.append('ordenDeCompra', null);
    formData.append('recepcionDePedidos', null);
    return this.http.post<Factura>(
      this.API_URL + 'save-file/' + factura.ordenDeCompra.idordendecompra,
      formData
    );
  }

  getFile(id: number): Observable<File> {
    return this.http.get<File>(this.API_URL + 'archivo/' + id);
  }
}
