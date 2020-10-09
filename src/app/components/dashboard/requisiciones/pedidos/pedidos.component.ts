// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Modelos
import { Requisicion } from 'src/app/models/requisicion';
import { Pedido } from 'src/app/models/pedido';
// Servicios
import { RequisicionService } from 'src/app/services/requisicion.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent implements OnInit {
  requisicion: Requisicion;
  pedidos: Pedido[];
  pedido: Pedido;
  selectedPedido: Pedido;
  items: MenuItem[];
  displaySaveEditDialog: boolean = false;

  constructor(
    private requisicionService: RequisicionService,
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
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

  eliminar(pedido: Pedido) {
    console.log(pedido);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idrequisition: number = +params.get('id');
      this.obtenerRequisicion(idrequisition);
    });
  }
}
