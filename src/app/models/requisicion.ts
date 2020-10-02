import { Centrodecostos } from './centrodecostos';
import { Usuario } from './Usuario';

export class Requisicion {
    constructor(

      public idrequisicion: number =null,
      public numerorequisicion: number = null,
      public referencia: number = null,
      public fechaderegistro: Date = null,
      public usuario: Usuario,
      public centroDeCostos: Centrodecostos = null,
      public observaciones: string = null,

    ){}
}
