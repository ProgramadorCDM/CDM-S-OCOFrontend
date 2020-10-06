// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Categoria } from 'src/app/models/categoria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService extends CommonService<Categoria, number> {
  protected API_URL: string = 'http://localhost:8080/api/categorias/';
  constructor(protected http: HttpClient) {
    super(http);
  }
}
