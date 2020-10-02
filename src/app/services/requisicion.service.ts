// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Requisicion } from "src/app/models/requisicion";

@Injectable({
  providedIn: 'root',
})
export class RequisicionService extends CommonService<Requisicion, number> {
  protected API_URL: string = 'http://localhost:8080/api/requisitions/';
  constructor(http: HttpClient) {
    super(http);
  }
}
