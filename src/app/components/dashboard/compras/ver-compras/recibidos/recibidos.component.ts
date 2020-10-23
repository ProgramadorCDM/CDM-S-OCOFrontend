// Angular
import { Component, OnInit } from '@angular/core';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
// Services
import { PedidoService } from 'src/app/services/pedido.service';
import { RecepcionService } from 'src/app/services/recepcion.service';
// Models
import { Pedido } from 'src/app/models/pedido';
import { Recepcion } from 'src/app/models/recepcion';

@Component({
  selector: 'app-recibidos',
  templateUrl: './recibidos.component.html',
  styleUrls: ['./recibidos.component.css'],
})
export class RecibidosComponent implements OnInit {
  pedido: Pedido;
  recibidos: Recepcion[];
  selectedRecibidos: Recepcion[];

  obtenerPedido() {
    this.pedido = this.config.data.pedido;
    this.obtenerRecepciones();
  }

  obtenerRecepciones() {
    this.recepcionService
      .buscarRecepcionesPorPedidos(this.pedido.idpedido)
      .subscribe((array: Recepcion[]) => {
        let recibidos: Recepcion[] = [];
        for (let index = 0; index < array.length; index++) {
          const recibido = array[index];
          recibidos.push(recibido);
        }
        this.recibidos = recibidos.sort(function (a, b) {
          if (a.idrecepciondepedido > b.idrecepciondepedido) {
            return 1;
          }
          if (a.idrecepciondepedido < b.idrecepciondepedido) {
            return 0;
          }
          return 0;
        });
        console.log(this.recibidos);
      });
  }

  onEliminar() {
    this.selectedRecibidos.forEach((e) => this.eliminar(e));
    this.selectedRecibidos = [];
  }

  eliminar(recepcion: Recepcion) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar el registro?',
      accept: () => {
        this.recepcionService
          .delete(recepcion.idrecepciondepedido)
          .subscribe((recepcionR: Recepcion) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Eliminado',
              detail: 'el registro ha sido eliminado correctamente',
            });
            this.validarEliminar(recepcionR);
          });
      },
    });
  }
  validarEliminar(recepcionR: Recepcion) {
    this.recibidos.splice(
      this.recibidos.findIndex((e) => e === recepcionR),
      1
    );
  }

  constructor(
    private pedidoService: PedidoService,
    private recepcionService: RecepcionService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.obtenerPedido();
  }
}
