import { Proveedor } from './proveedor';
import { Requisicion } from './requisicion';
import { Usuario } from './Usuario';

export class OrdenDeCompra {
  constructor(
    public idordendecompra: number = null,
    public numerodeorden: number = null,
    public fechadeorden: Date = null,
    public proveedor: Proveedor = null,
    public condestinoa: string = null,
    public contacto: string = null,
    public concargoa: string = null,
    public transportador: string = null,
    public numerodeguia: string = null,
    public formadepago: string = null,
    public usuario: Usuario = null,
    public observaciones: string = null,
    public requisition: Requisicion = null,
    public fechaderegistro: Date = null,
    public fechadeactualizado: Date = null,
    public iva: number = null,
    public exentodeiva: boolean = null,
    public valoriva: number = null,
    public centrodecostos: string = null,
    public solicitados: number = null,
    public recibidos: number = null,
  ){}
}
