// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { RequisicionService } from 'src/app/services/requisicion.service';
import { RecepcionService } from 'src/app/services/recepcion.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
// Modelos
import { OrdenDeCompra } from 'src/app/models/ordendecompra';
import { Pedido } from 'src/app/models/pedido';
import { Recepcion } from 'src/app/models/recepcion';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
})
export class ComprasComponent implements OnInit {
  ordenes: OrdenDeCompra[];
  orden: OrdenDeCompra;
  selectedOrden: OrdenDeCompra;
  items: MenuItem[];
  formRequisicion: FormGroup;
  displaySaveEditDialog: boolean = false;

  constructor(
    private requisicionService: RequisicionService,
    private pedidoService: PedidoService,
    private ordenService: OrdendecompraService,
    private recepcionService: RecepcionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  obtenerCompras() {
    this.ordenService.getAll().subscribe((ordenesList: OrdenDeCompra[]) => {
      let ordenes: OrdenDeCompra[] = [];
      for (let index = 0; index < ordenesList.length; index++) {
        let orden = ordenesList[index];
        this.pedidoService
          .buscarSolicitadosPorOrden(orden.idordendecompra)
          .subscribe((solicitados: number) => {
            if (solicitados) {
              orden.solicitados = solicitados;
            } else orden.solicitados = 0;
          });
        this.recepcionService
          .buscarRecibidosPorOrden(orden.idordendecompra)
          .subscribe((recibidos: number) => {
            if (recibidos) {
              orden.recibidos = recibidos;
            } else orden.recibidos = 0;
          });
        ordenes.push(orden);
      }
      this.ordenes = ordenes.sort(function (a, b) {
        if (a.numerodeorden < b.numerodeorden) {
          return 1;
        }
        if (a.numerodeorden > b.numerodeorden) {
          return -1;
        }
        return 0;
      });
      console.log(this.ordenes);
    });
  }

  verOrden(orden: OrdenDeCompra) {
    let fileURL: string = null;
    fileURL = 'http://localhost:8080/api/ordenes/pdf/' + orden.idordendecompra;
    window.open(fileURL);
  }

  ngOnInit(): void {
    this.obtenerCompras();
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        // command: () => this.showSaveDialog(false),
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        // command: () => this.showSaveDialog(true),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        // command: () => this.eliminar(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerCompras(),
      },
    ];
  }
}
