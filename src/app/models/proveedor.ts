import { Producto } from './producto';
import { Usuario } from './Usuario';

export class Proveedor {
  constructor(
    public idproveedor: number = null,
    public nombreprovee: string = null,
    public nitprovee: string = null,
    public direccionprovee: string = null,
    public telefonofijoprovee: string = null,
    public celularprovee: string = null,
    public correoprovee: string = null,
    public paginawebprovee: string = null,
    public fechaderegistro: Date = null,
    public fechaactualizado: Date = null,
    public usuario: Usuario = null,
    public ciudad: string = null,
    public productos: Array<Producto> = null
  ) {}
}
