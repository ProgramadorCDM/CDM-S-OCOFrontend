// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
// PrimeNG
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Modelos
import { OrdenDeCompra } from 'src/app/models/ordendecompra';
import { Pedido } from 'src/app/models/pedido';
import { Recepcion } from 'src/app/models/recepcion';
import { Factura } from 'src/app/models/factura';
// Servicios
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RecepcionService } from 'src/app/services/recepcion.service';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-ver-compras',
  templateUrl: './ver-compras.component.html',
  styleUrls: ['./ver-compras.component.css'],
})
export class VerComprasComponent implements OnInit {
  orden: OrdenDeCompra;
  pedidos: Pedido[];
  facturas: Factura[] = [];
  items: MenuItem[];

  constructor(
    private ordenDeCompraService: OrdendecompraService,
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute,
    private recepcionService: RecepcionService,
    private facturaService: FacturaService
  ) {}

  obtenerOrdenCompra(idOrden: number) {
    this.ordenDeCompraService
      .getOne(idOrden)
      .subscribe((orden: OrdenDeCompra) => {
        this.orden = orden;
        console.info(this.orden);
      });
  }

  obtenerPedidos(idOrden: number) {
    this.pedidoService
      .buscarPedidosPorOrden(idOrden)
      .subscribe((array: Pedido[]) => {
        let pedidos: Pedido[] = [];
        for (let index = 0; index < array.length; index++) {
          const pedido = array[index];
          let recibidos: number = 0;
          this.recepcionService
            .buscarRecepcionesPorPedidos(pedido.idpedido)
            .subscribe((array: Recepcion[]) => {
              if (array.length === 0) {
                recibidos = 0;
              } else {
                for (let index = 0; index < array.length; index++) {
                  const recepcion = array[index];
                  recibidos = recibidos + recepcion.cantidadrecibida;
                }
              }
              pedido.recibidos = recibidos;
              pedidos.push(pedido);
            });
        }
        this.pedidos = pedidos.sort(function (a, b) {
          if (a.producto.nombreproducto < b.producto.nombreproducto) {
            return 1;
          }
          if (a.producto.nombreproducto > b.producto.nombreproducto) {
            return -1;
          }
          return 0;
        });
        console.info(this.pedidos);
      });
  }

  obtenerFacturas(idOrden: number) {
    this.facturaService
      .obtenerFacturasPorOrden(idOrden)
      .subscribe((array: Factura[]) => {
        let facturas: Factura[] = [];
        for (let index = 0; index < array.length; index++) {
          const factura = array[index];
          facturas.push(factura);
        }
        this.facturas = facturas.sort(function (a, b) {
          if (a.fechaderegistro > b.fechaderegistro) {
            return 1;
          }
          if (a.fechaderegistro < b.fechaderegistro) {
            return -1;
          }
          return 0;
        });
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idOrden: number = +params.get('id');
      this.obtenerOrdenCompra(idOrden);
      this.obtenerPedidos(idOrden);
      this.obtenerFacturas(idOrden);
    });
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
      {
        label: 'Angular Website',
        icon: 'pi pi-external-link',
        url: 'http://angular.io',
      },
      {
        label: 'Router',
        icon: 'pi pi-upload',
        routerLink: '/fileupload',
      },
    ];
  }
}
