import { Pedido } from './pedido';
import { Usuario } from './Usuario';

export class Recepcion {
  constructor(
    public idrecepciondepedido: number = null,
    public pedido: Pedido = null,
    public fechaderecibido: Date = null,
    public cantidadrecibida: number = null,
    public preciofinal: number = null,
    public factura: string = null,
    public remision: string = null,
    public observaciones: string = null,
    public usuario: Usuario = null,
    public fechaderegistro: Date = null
  ) {}
}
