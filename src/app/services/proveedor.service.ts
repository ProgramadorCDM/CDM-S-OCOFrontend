// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Proveedor } from "src/app/models/proveedor";

@Injectable({
  providedIn: 'root',
})
export class ProveedorService extends CommonService<Proveedor, number> {
  protected API_URL: string = 'http://localhost:8080/api/proveedores/';
  constructor(http: HttpClient) {
    super(http);
  }
}
