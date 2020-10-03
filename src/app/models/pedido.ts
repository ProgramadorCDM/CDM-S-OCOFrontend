import { OrdenDeCompra } from './ordendecompra';
import { Producto } from './producto';
import { Requisicion } from './requisicion';

export class Pedido {
  constructor(
    public idpedido: number = null,
    public requisition: Requisicion= null,
    public producto: Producto,
    public cantidadsolicitada: number = null,
    public precioinicial: number = null,
    public destino: string = null,
    public observaciones: string = null,
    public fechaderegistro: Date = null,
    public ordenDeCompra: OrdenDeCompra = null,
  ){}
}
