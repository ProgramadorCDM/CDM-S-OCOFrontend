// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Categoria } from 'src/app/models/categoria';
import { Observable } from 'rxjs';
// Enviroment
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService extends CommonService<Categoria, number> {
  // protected API_URL: string = 'http://localhost:8080/api/categorias/';
  protected API_URL: string = `${environment.API_URL}/categorias/`;
  constructor(protected http: HttpClient) {
    super(http);
  }
}
