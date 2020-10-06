import { Categoria } from './categoria';
import { Usuario } from './Usuario';

export class Producto {
  constructor(
    public idproducto: number = null,
    public codigoproducto: string = null,
    public nombreproducto: string = null,
    public medida: string = null,
    public fechaderegistro: Date = null,
    public usuario: Usuario = null,
    public categoria: Categoria = null,
    public imagenHashCode: number = null
  ) {}
}
