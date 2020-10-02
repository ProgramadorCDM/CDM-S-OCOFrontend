// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { ProveedorService } from 'src/app/services/proveedor.service';
import { AuthService } from 'src/app/services/auth.service';
// Modelos
import { Proveedor } from 'src/app/models/proveedor';

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
  displaySaveEditDialog;

  constructor(
    private proveedorService: ProveedorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  obtenerProveedores(){
    this.proveedorService.getAll().subscribe(
      (array: Proveedor[]) => {
        let proveedores: Proveedor[]=[]
        for (let index = 0; index < array.length; index++) {
          let element = array[index];
          proveedores.push(element)
        }
        this.proveedores = proveedores.sort(function (a, b) {
          if (a.nombreprovee > b.nombreprovee) {
            return 1
          }
          if (a.nombreprovee < b.nombreprovee) {
            return -1;
          }
          return 0
        })
      }
    )
  }

  ngOnInit(): void {
    this.obtenerProveedores();
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
        command: () => this.obtenerProveedores(),
      },
    ];
  }
}
