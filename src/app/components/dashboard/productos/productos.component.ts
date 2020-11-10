// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
// Modelos
import { Producto } from 'src/app/models/producto';
import { Categoria } from 'src/app/models/categoria';
import { Usuario } from 'src/app/models/Usuario';
// Environment
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  productos: Producto[];
  producto: Producto;
  selectedProducto: Producto = {
    categoria: null,
    codigoproducto: null,
    fechaderegistro: null,
    idproducto: null,
    medida: null,
    nombreproducto: null,
    usuario: null,
    imagenHashCode: null,
  };
  categorias: Categoria[];
  items: MenuItem[];
  formProducto: FormGroup;
  displaySaveEditDialog: boolean = false;
  first = 0;
  rows = 10;
  selectedImage: File;
  currentUser: Usuario = new Usuario();
  url: string = environment.API_URL

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private categoriaService: CategoriaService,
    private confirmationService: ConfirmationService,
    private tokenService: TokenStorageService,
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

  obtenerCategorias() {
    this.categoriaService.getAll().subscribe((listCategorias: Categoria[]) => {
      let categorias: Categoria[] = [];
      for (let index = 0; index < listCategorias.length; index++) {
        let categoria = listCategorias[index];
        categorias.push(categoria);
      }
      this.categorias = categorias.sort(function (a, b) {
        if (a.nombrecategoria > b.nombrecategoria) {
          return 1;
        }
        if (a.nombrecategoria < b.nombrecategoria) {
          return -1;
        }
        return 0;
      });
    });
  }

  guardarProducto() {
    if (!this.selectedImage) {
      this.productoService
        .save(this.producto)
        .subscribe((producto: Producto) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Correcto!',
            detail:
              'El Producto ' +
              producto.nombreproducto +
              ' ha sido creado correctamente',
          });
          this.displaySaveEditDialog = false;
          this.validarPRoducto(producto);
        });
    } else {
      this.productoService
        .save(this.producto)
        .subscribe((producto: Producto) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Correcto!',
            detail:
              'El Producto ' +
              producto.nombreproducto +
              ' ha sido creado correctamente',
          });
          this.displaySaveEditDialog = false;
          this.validarPRoducto(producto);
        });
    }
  }
  validarPRoducto(producto: Producto) {
    let index = this.productos.findIndex(
      (e) => e.idproducto === producto.idproducto
    );
    if (index != -1) {
      this.productos[index] = producto;
    } else {
      this.productos.push(producto);
    }
  }

  mostrarDialogoGuardar(editar: boolean) {
    this.formProducto.reset();
    if (editar) {
      if (
        this.selectedProducto !== null &&
        this.selectedProducto.idproducto !== null
      ) {
        this.formProducto.patchValue(this.selectedProducto);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'Debe Seleccionar un Producto',
        });
        return;
      }
    } else {
      this.producto = new Producto();
      this.selectedProducto = null;
    }
    this.displaySaveEditDialog = true;
  }

  onGuardar() {
    this.formProducto.patchValue({
      usuario: this.currentUser,
    });
    this.producto = this.formProducto.value;
    this.guardarProducto();
  }

  eliminar(producto: Producto) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar este producto?',
      accept: () => {
        this.productoService
          .delete(producto.idproducto)
          .subscribe((result: Producto) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Eliminado',
              detail:
                'el producto ' +
                producto.nombreproducto +
                ' ha sido eliminado correctamente',
            });
            this.eliminarProducto(producto);
          });
      },
    });
  }
  eliminarProducto(producto: Producto) {
    let index = this.productos.findIndex(
      (e) => e.idproducto === producto.idproducto
    );
    if (index != -1) {
      this.productos.splice(index, 1);
    }
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategorias();
    this.currentUser = {
      email: this.tokenService.getUser().email,
      idusuario: this.tokenService.getUser().idusuario,
      nombreusuario: this.tokenService.getUser().nombreusuario,
      usuario: this.tokenService.getUser().usuario,
    };
    this.formProducto = this.fb.group({
      nombreproducto: new FormControl(null, Validators.required),
      codigoproducto: new FormControl(null, Validators.required),
      medida: new FormControl(null, Validators.required),
      categoria: new FormControl(null, Validators.required),
      usuario: new FormControl(),
      fechaderegistro: new FormControl(),
      idproducto: new FormControl(),
    });
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => this.mostrarDialogoGuardar(false),
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.mostrarDialogoGuardar(true),
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
