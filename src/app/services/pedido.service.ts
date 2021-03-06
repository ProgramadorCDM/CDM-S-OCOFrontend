// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Servicio Generico
import { CommonService } from './common.service';
// Modelo
import { Pedido } from 'src/app/models/pedido';
import { Observable } from 'rxjs';
// Ambiente
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidoService extends CommonService<Pedido, number> {
  // protected API_URL: string = 'http://localhost:8080/api/pedidos/';
  protected API_URL: string = `${environment.API_URL}/pedidos/`;
  constructor(protected http: HttpClient) {
    super(http);
  }

  buscarPedidosPorRequicision(id: number): Observable<number[]> {
    return this.http.get<number[]>(this.API_URL + 'por/' + id);
  }

  buscarPedidosPorRequicisionSinOrden(id: number): Observable<number[]> {
    return this.http.get<number[]>(this.API_URL + 'sinOrden/' + id);
  }

  buscarPedidosPorOrden(id: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.API_URL + 'orden/' + id);
  }

  buscarSolicitadosPorOrden(id: number): Observable<number> {
    return this.http.get<number>(this.API_URL + 'solicitados/' + id);
  }

  obtenerPedido(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(this.API_URL + id);
  }
}
