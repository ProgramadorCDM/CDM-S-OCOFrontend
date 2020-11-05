// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Proveedor } from 'src/app/models/proveedor';
import { Producto } from 'src/app/models/producto';
// RxJS
import { Observable } from 'rxjs';
// Variable de Ambiente
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService extends CommonService<Proveedor, number> {
  // protected API_URL: string = 'http://localhost:8080/api/proveedores/';
  protected API_URL: string = `${environment.API_URL}/proveedores/`;
  constructor(http: HttpClient) {
    super(http);
  }
  agregarProductos(
    proveedor: Proveedor,
    productos: Producto[]
  ): Observable<Proveedor> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    return this.http.put<Proveedor>(
      this.API_URL + proveedor.idproveedor + '/productos/cargar',
      productos,
      { headers: headers }
    );
  }
  eliminarProducto(
    proveedor: Proveedor,
    producto: Producto
  ): Observable<Proveedor> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    return this.http.put<Proveedor>(
      this.API_URL + proveedor.idproveedor + '/productos/eliminar',
      producto,
      { headers: headers }
    );
  }
}
