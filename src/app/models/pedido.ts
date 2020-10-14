import { OrdenDeCompra } from './ordendecompra';
import { Producto } from './producto';
import { Requisicion } from './requisicion';

export class Pedido {
  constructor(
    public idpedido: number = null,
    public requisition: Requisicion= null,
    public producto: Producto = null,
    public cantidadsolicitada: number = 0.00,
    public precioinicial: number = 0.00,
    public destino: string = null,
    public observaciones: string = null,
    public fechaderegistro: Date = null,
    public ordenDeCompra: OrdenDeCompra = null,
  ){}
}
