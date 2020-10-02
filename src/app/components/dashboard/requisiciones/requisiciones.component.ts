// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { RequisicionService } from 'src/app/services/requisicion.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
// Modelos
import { Requisicion } from 'src/app/models/requisicion';

@Component({
  selector: 'app-requisiciones',
  templateUrl: './requisiciones.component.html',
  styleUrls: ['./requisiciones.component.css'],
})
export class RequisicionesComponent implements OnInit {
  requisiciones: Requisicion[];
  requicicion: Requisicion;
  selectedRequisicion: Requisicion;
  items: MenuItem[];
  formRequisicion: FormGroup;
  displaySaveEditDialog: boolean = false;

  constructor(
    private requisicionService: RequisicionService,
    private pedidoService: PedidoService,
    private ordenService: OrdendecompraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  obtenerRequisiciones() {
    this.requisicionService.getAll().subscribe((array: Requisicion[]) => {
      let requisiciones: Requisicion[] = [];
      for (let index = 0; index < array.length; index++) {
        let requisicion = array[index];
        this.pedidoService
          .buscarPedidosPorRequicision(requisicion.idrequisicion)
          .subscribe((data: number[]) => {
            requisicion.items = data.length;
            this.ordenService
              .buscarOrdenesPorRequisiciones(requisicion.idrequisicion)
              .subscribe((data: number[]) => {
                  requisicion.pendientes = requisicion.items - data.length
              });
          });
        requisiciones.push(requisicion);
      }
      this.requisiciones = requisiciones.sort(function (a, b) {
        if (a.numerorequisicion > b.numerorequisicion) {
          return -1;
        }
        if (a.numerorequisicion < b.numerorequisicion) {
          return 1;
        }
        return 0;
      });
      console.log(this.requisiciones);
    });
  }

  ngOnInit(): void {
    this.obtenerRequisiciones();
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
        command: () => this.obtenerRequisiciones(),
      },
    ];
  }
}
