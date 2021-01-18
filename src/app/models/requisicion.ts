import { Centrodecostos } from './centrodecostos';
import { Usuario } from './Usuario';

export class Requisicion {
    constructor(
      public idrequisicion: number = null,
      public numerorequisicion: number = null,
      public referencia: string = null,
      public fechaderegistro: Date = null,
      public usuario: Usuario = null,
      public centroDeCostos: Centrodecostos = null,
      public observaciones: string = null,
      public totales: number = null,
      public pendientes: number = null
    ){}
}
