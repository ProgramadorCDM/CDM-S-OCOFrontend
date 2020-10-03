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
    this.ordenService.getAll().subscribe((array: OrdenDeCompra[]) => {
      let ordenes: OrdenDeCompra[] = [];
      for (let index = 0; index < array.length; index++) {
        let orden = array[index];
        if (
          orden.requisition !== null &&
          orden.requisition.idrequisicion !== null
        ) {
          this.pedidoService
            .buscarPedidosPorRequicision(orden.requisition.idrequisicion)
            .subscribe((data: number[]) => {
              orden.recibidos = data.length;
            });
        }
        this.pedidoService
          .buscarPedidosPorOrden(orden.idordendecompra)
          .subscribe((data: number[]) => {
            orden.solicitados = data.length;
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
