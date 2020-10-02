import { Cliente } from './cliente';
import { Usuario } from './usuario';
export class Centrodecostos {
  constructor(
    public idcentrodecostos: number = null,
    public centro_de_costos: string = null,
    public cliente: Cliente = null,
    public usuario: Usuario = null
  ) {}
}
