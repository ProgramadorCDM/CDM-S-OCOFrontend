// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Modelos
import { Requisicion } from 'src/app/models/requisicion';
import { Pedido } from 'src/app/models/pedido';
// Servicios
import { RequisicionService } from 'src/app/services/requisicion.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent implements OnInit {
  requisicion: Requisicion;
  pedidos: Pedido[];
  pedido: Pedido;
  selectedPedidos: Pedido[] = [];
  formPedido: FormGroup;
  items: MenuItem[];
  displaySaveEditDialog: boolean = false;

  constructor(
    private requisicionService: RequisicionService,
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tokenService: TokenStorageService
  ) {}

  obtenerRequisicion(idrequisition: number) {
    this.requisicionService
      .getOne(idrequisition)
      .subscribe((requisicion: Requisicion) => {
        this.requisicion = requisicion;
      });
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    this.pedidoService.getAll().subscribe(
      (array: Pedido[]) => {
        let pedidos: Pedido[] = [];
        for (let index = 0; index < array.length; index++) {
          let pedido = array[index];
          if (
            pedido.requisition.idrequisicion === this.requisicion.idrequisicion
          ) {
            pedidos.push(pedido);
          }
        }
        this.pedidos = pedidos.sort(function (a, b) {
          if (a.producto.nombreproducto > b.producto.nombreproducto) {
            return 1;
          }
          if (a.producto.nombreproducto < b.producto.nombreproducto) {
            return -1;
          }
          return 0;
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  guardarPedido() {
    this.pedidoService.save(this.pedido).subscribe((pedido: Pedido) => {
      this.messageService.add({
        severity: 'success',
        summary: '¡Agregado!',
        detail:
          'El producto ' +
          pedido.producto.nombreproducto +
          ' ha sido agregado correctamente',
        key: 'bc',
      });
      this.displaySaveEditDialog = false;
      this.validarPedido(pedido);
    });
  }
  validarPedido(pedido: Pedido) {
    let index = this.pedidos.findIndex((e) => {
      e.idpedido === pedido.idpedido;
    });
    if (index != -1) {
      this.pedidos[index] = pedido;
    } else {
      this.pedidos.push(pedido);
    }
  }

  mostrarDialogoGuardar(editar: boolean, pedido: Pedido) {
    if (editar) {
      if (pedido !== null && pedido.idpedido !== null) {
        this.formPedido.patchValue(pedido);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'Debe Seleccionar un Producto',
        });
        return;
      }
    } else {
      this.pedido = new Pedido();
    }
    this.displaySaveEditDialog = true;
  }

  onGuardar() {
    this.pedido = this.formPedido.value;
    this.guardarPedido();
  }

  eliminar(pedido: Pedido) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar este producto?',
      accept: () => {
        this.pedidoService
          .delete(pedido.idpedido)
          .subscribe((result: Pedido) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Eliminado',
              detail:
                'el producto ' +
                pedido.producto.nombreproducto +
                ' ha sido eliminado correctamente',
            });
            this.eliminarPedido(result);
          });
      },
    });
  }
  eliminarPedido(pedido: Pedido) {
    let index = this.pedidos.findIndex((e) => {
      e.idpedido === pedido.idpedido;
    });
    if (index != -1) {
      this.pedidos.splice(index, 1);
    }
  }

  volver() {
    this.router.navigateByUrl('/requisiciones');
  }

  onRowSelect(event) {
    if (event.data.ordenDeCompra !== null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Este Producto ya tiene OCO',
        detail: event.data.producto.nombreproducto,
        key: 'bc',
      });
      let index = this.selectedPedidos.findIndex((e) => {
        event.data.idpedido === e.idpedido;
      });
      this.selectedPedidos.splice(index, 1);
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Producto Seleccionado',
        detail: event.data.producto.nombreproducto,
        key: 'bc',
      });
    }
  }

  onRowUnselect(event) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Producto eliminado de la lista',
      detail: event.data.producto.nombreproducto,
      key: 'bc',
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idrequisition: number = +params.get('id');
      this.obtenerRequisicion(idrequisition);
    });
  }
}
