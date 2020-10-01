// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Producto } from 'src/app/models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService extends CommonService<Producto, number> {
  protected API_URL: string = 'http://localhost:8080/api/productos/';
  constructor(http: HttpClient) {
    super(http);
  }
}
