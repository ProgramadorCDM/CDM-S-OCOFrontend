// Angular
import { Component, OnInit } from '@angular/core';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
// Services
import { ProductoService } from 'src/app/services/producto.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
// Models
import { Producto } from 'src/app/models/producto';
import { Proveedor } from 'src/app/models/proveedor';

@Component({
  selector: 'app-productosbyproveedor',
  templateUrl: './productosbyproveedor.component.html',
  styleUrls: ['./productosbyproveedor.component.css'],
})
export class ProductosbyproveedorComponent implements OnInit {
  arrayProductos: Producto[];
  arrayAddProductos: Producto[] = [];
  arrayAllProductos: Producto[];
  selecteProducto: Producto;
  selectedProductos: Producto[];
  displayModal = false;

  constructor(
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  obtenerProductos() {
    this.arrayProductos = this.config.data.proveedor.productos;
  }

  obtenerTodosProductos() {
    this.productoService.getAll().subscribe((array: Producto[]) => {
      let productos: Producto[] = [];
      for (let index = 0; index < array.length; index++) {
        let element = array[index] as Producto;
        let i = this.arrayProductos.findIndex(
          (e) => e.idproducto === element.idproducto
        );
        if (i == -1) {
          productos.push(element);
        }
      }
      this.arrayAllProductos = productos.sort(function (a, b) {
        if (a.nombreproducto > b.nombreproducto) {
          return 1;
        }
        if (a.nombreproducto < b.nombreproducto) {
          return -1;
        }
        return 0;
      });
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerTodosProductos();
  }

  agregarProducto() {
    this.ref.close(this.arrayAddProductos);
  }

  borrarProducto(producto: Producto) {
    let proveedor = this.config.data.proveedor as Proveedor;
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el Producto?',
      accept: () => {
        this.proveedorService
          .eliminarProducto(proveedor, producto)
          .subscribe((proveedor: Proveedor) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Correcto',
              detail:
                'Eliminado el producto del proveedor' + proveedor.nombreprovee,
            });
            this.arrayProductos = proveedor.productos;
            this.obtenerTodosProductos();
          });
      },
    });
  }
}
