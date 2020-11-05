// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Producto } from 'src/app/models/producto';
import { Observable } from 'rxjs';
// Variable de Ambiente
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService extends CommonService<Producto, number> {
  // protected API_URL: string = 'http://localhost:8080/api/productos/';
  protected API_URL: string = `${environment.API_URL}/productos/`;
  constructor(http: HttpClient) {
    super(http);
  }
  crearConFoto(producto: Producto, archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('nombreproducto', producto.nombreproducto);
    formData.append('codigoproducto', producto.codigoproducto);
    formData.append('medida', producto.medida);
    // formData.append('idproducto', producto.idproducto);
    // formData.append('fechaderegistro', producto.fechaderegistro);
    // formData.append('usuario', producto.usuario);
    // formData.append('categoria', producto.categoria);
    return this.http.post<Producto>(this.API_URL + 'save-with-photo', formData);
  }
}
