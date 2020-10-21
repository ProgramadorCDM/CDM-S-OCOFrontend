import { OrdenDeCompra } from './ordendecompra';
import { Recepcion } from './recepcion';

export class Factura {
  constructor(
    public idfactrua: number = null,
    public formato: string = null,
    public nombrearchivo: string = null,
    public fechaderegistro: Date = null,
    public ordenDeCompra: OrdenDeCompra = null,
    public recepcionDePedidos: Recepcion = null
  ) {}
}
