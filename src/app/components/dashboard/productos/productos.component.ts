// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { ProductoService } from 'src/app/services/producto.service';
import { AuthService } from 'src/app/services/auth.service';
// Modelos
import { Producto } from 'src/app/models/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  productos: Producto[];
  producto: Producto;
  selectedProducto: Producto;
  items: MenuItem[];
  formProducto: FormGroup;
  displaySaveEditDialog: boolean = false;
  first = 0;
  rows = 10;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  obtenerProductos() {
    this.productoService.getAll().subscribe((listProductos: Producto[]) => {
      let productos: Producto[] = [];
      for (let index = 0; index < listProductos.length; index++) {
        let producto = listProductos[index];
        productos.push(producto);
      }
      this.productos = productos.sort(function (a, b) {
        if (a.nombreproducto > b.nombreproducto) {
          return 1;
        }
        if (a.nombreproducto > b.nombreproducto) {
          return -1;
        }
        return 0;
      });
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
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
      // {
      //   label: 'Eliminar',
      //   icon: 'pi pi-fw pi-trash',
      //   command: () => this.eliminar(),
      // },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerProductos(),
      },
    ];
  }
}
