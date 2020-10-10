// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
// Services
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
// Modelos
import { Proveedor } from 'src/app/models/proveedor';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/Usuario';
// Component
import { ProductosbyproveedorComponent } from './productosbyproveedor/productosbyproveedor.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[];
  proveedor: Proveedor;
  selectedProveedor: Proveedor;
  items: MenuItem[];
  formProveedor: FormGroup;
  displaySaveEditDialog: boolean = false;
  currentUser: Usuario = new Usuario();

  constructor(
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tokenService: TokenStorageService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {}

  obtenerProveedores() {
    this.proveedorService.getAll().subscribe((array: Proveedor[]) => {
      let proveedores: Proveedor[] = [];
      for (let index = 0; index < array.length; index++) {
        let element = array[index];
        proveedores.push(element);
      }
      this.proveedores = proveedores.sort(function (a, b) {
        if (a.nombreprovee > b.nombreprovee) {
          return 1;
        }
        if (a.nombreprovee < b.nombreprovee) {
          return -1;
        }
        return 0;
      });
    });
  }

  guardarProveedor() {
    this.proveedorService
      .save(this.proveedor)
      .subscribe((proveedor: Proveedor) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Correcto!',
          detail:
            'El proveedor ' +
            proveedor.nombreprovee +
            ' ha sido guardado correctamente',
        });
        this.displaySaveEditDialog = false;
        this.validarProveedor(proveedor);
      });
  }
  validarProveedor(proveedor: Proveedor) {
    let index = this.proveedores.findIndex(
      (e) => (e.idproveedor = proveedor.idproveedor)
    );
    if (index != -1) {
      this.proveedores[index] = proveedor;
    } else {
      this.proveedores.push(proveedor);
    }
  }

  mostrarDialogoGuardar(editar: boolean) {
    this.formProveedor.reset();
    if (editar) {
      if (
        this.selectedProveedor !== null &&
        this.selectedProveedor.idproveedor !== null
      ) {
        this.formProveedor.patchValue(this.selectedProveedor);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'Debe seleccionar un proveedor',
        });
        return;
      }
    } else {
      this.proveedor = new Proveedor();
      this.selectedProveedor = null;
    }
    this.displaySaveEditDialog = true;
  }

  onGuardar() {
    this.formProveedor.patchValue({
      usuario: this.currentUser,
    });
    this.proveedor = this.formProveedor.value;
    this.guardarProveedor();
  }

  eliminar(proveedor: Proveedor) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea elminiar esta proveedor?',
      accept: () => {
        this.proveedorService.delete(proveedor.idproveedor).subscribe(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Eliminado',
            detail: 'el proveedor ha sido eliminado correctamente',
          });
          this.eliminarProveedor(proveedor);
        });
      },
    });
  }
  eliminarProveedor(proveedor: Proveedor) {
    let index = this.proveedores.findIndex(
      (e) => (e.idproveedor = proveedor.idproveedor)
    );
    if (index != -1) {
      this.proveedores.splice(index, 1);
    }
  }

  ngOnInit(): void {
    this.obtenerProveedores();
    this.currentUser = {
      email: this.tokenService.getUser().email,
      idusuario: this.tokenService.getUser().idusuario,
      nombreusuario: this.tokenService.getUser().nombreusuario,
      usuario: this.tokenService.getUser().usuario,
    };
    this.formProveedor = this.fb.group({
      idproveedor: new FormControl(),
      nombreprovee: new FormControl(null, Validators.required),
      nitprovee: new FormControl(null, Validators.required),
      direccionprovee: new FormControl(null, Validators.required),
      telefonofijoprovee: new FormControl(null, Validators.required),
      celularprovee: new FormControl(null, Validators.required),
      correoprovee: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.email])
      ),
      paginawebprovee: new FormControl(),
      fechaderegistro: new FormControl(),
      fechaactualizado: new FormControl(),
      usuario: new FormControl(),
      ciudad: new FormControl(null, Validators.required),
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
        command: () => this.obtenerProveedores(),
      },
    ];
  }
  show(proveedor: Proveedor) {
    console.log('mostrando proveedor');
    const ref = this.dialogService.open(ProductosbyproveedorComponent, {
      header: 'Lista de Productos',
      width: '100%',
      height: '100%',
      data: {
        proveedor: proveedor,
      },
      contentStyle: 'p-fluid',
      style: 'background: #ffffff;',
    });
    ref.onClose.subscribe((productos: Producto[]) => {
      this.proveedorService
        .agregarProductos(proveedor, productos)
        .subscribe((nuevoProveedor: Proveedor) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Agregado',
            detail: 'Se ha agregado los productos con Exito',
          });
          this.validarProveedor(nuevoProveedor);
        });
    });
  }
}
