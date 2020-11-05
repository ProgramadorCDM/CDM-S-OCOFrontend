// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { RequisicionService } from 'src/app/services/requisicion.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
// Modelos
import { Requisicion } from 'src/app/models/requisicion';
import { Pedido } from 'src/app/models/pedido';
// Component
import { PedidosComponent } from './pedidos/pedidos.component';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-requisiciones',
  templateUrl: './requisiciones.component.html',
  styleUrls: ['./requisiciones.component.css'],
})
export class RequisicionesComponent implements OnInit {
  requisiciones: Requisicion[];
  requisicion: Requisicion;
  selectedRequisicion: Requisicion;
  items: MenuItem[];
  formRequisicion: FormGroup;
  displaySaveEditDialog: boolean = false;
  currentUser: Usuario = new Usuario();

  constructor(
    private requisicionService: RequisicionService,
    private pedidoService: PedidoService,
    private ordenService: OrdendecompraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  /**
   * el siguiente comentario es para explicar el enrredo que sale a continuacion,
   * mis mas sinceros agradecimientos a Nelson Castiblanco por erredar esta pita asi.
   * Ok, primero solicitamos una lista completa de todas las requisiciones al servidor,
   * obtenida la lista iteramos los elementos uno a una para obtener los pedidos que
   * tiene dentro usamos <<el servicio que nos perpite buscar los pedidos por requisicion>>,
   * obteniendo la lista de los pedido de esa requisicion en particular, los agregamos a la
   * casilla pedidos del objeto requisicion y a su vez buscamos otra vez el el servidor cada
   * pedido y evaluamos si tiene orden de compra, si tienen orden de compra lo agregamos a una
   * lista temporal luego el tamaño de esa lista temporal se lo descontamos al tamagno de la
   * lista de los pedidos por requisicion y obtenemos los valores de la variable pendientes.
   * Ineficiente si, pero es lo que hay [[  PENDIENTE OPTIMIZACION DE ESTE METODO   ]]
   * 
   * 21 - OCTUBRE - 2020: Metodo Optimizado desde el Backend para que solo sea una consulta.
   */
  obtenerRequisiciones() {
    this.requisicionService.getAll().subscribe((array: Requisicion[]) => {
      let requisiciones: Requisicion[] = [];
      for (let index = 0; index < array.length; index++) {
        let requisicion = array[index];
        this.pedidoService
          .buscarPedidosPorRequicision(requisicion.idrequisicion)
          .subscribe((data: number[]) => {
            requisicion.items = data.length;
            if (data.length === 0) {
              requisicion.pendientes = 0;
            } else {
                this.pedidoService.buscarPedidosPorRequicisionSinOrden(
                  requisicion.idrequisicion
                ).subscribe((data: number[])=>{
                  requisicion.pendientes = data.length;
                });
            }
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
      // console.log(this.requisiciones);
    });
  }

  guardarRequisicion() {
    this.requisicionService
      .save(this.requisicion)
      .subscribe((requisicion: Requisicion) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Correcto!',
          detail:
            'La requisicion ' +
            requisicion.referencia +
            ' ha sido guardada correctamente',
        });
        this.displaySaveEditDialog = false;
        this.validarRequisicion(requisicion);
      });
  }
  validarRequisicion(requisicion: Requisicion) {
    let index = this.requisiciones.findIndex(
      (e) => e.idrequisicion === requisicion.idrequisicion
    );
    if (index != -1) {
      this.requisiciones[index] = requisicion;
    } else {
      this.requisiciones.push(requisicion);
    }
  }

  mostrarDialogoGuardar(editar: boolean) {
    this.formRequisicion.reset();
    if (editar) {
      if (
        this.selectedRequisicion !== null &&
        this.selectedRequisicion.idrequisicion !== null
      ) {
        this.formRequisicion.patchValue(this.selectedRequisicion);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'Debe seleccionar una requisicion',
        });
        return;
      }
    } else {
      this.requisicion = new Requisicion();
      this.selectedRequisicion = null;
    }
    this.displaySaveEditDialog = true;
  }

  onGuardar() {
    this.formRequisicion.patchValue({
      usuario: this.currentUser,
    });
    this.requisicion = this.formRequisicion.value;
    this.guardarRequisicion();
  }

  eliminar() {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar la Requisicion?',
      accept: () => {
        this.requisicionService
          .delete(this.selectedRequisicion.idrequisicion)
          .subscribe((requisicion: Requisicion) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Eliminado',
              detail:
                'la Requisicion ' +
                requisicion.referencia +
                ' ha sido eliminada correctamente',
            });
            this.eliminarRequisicion(requisicion);
          });
      },
    });
  }
  eliminarRequisicion(requisicion: Requisicion) {
    let index = this.requisiciones.findIndex(
      (e) => e.idrequisicion === requisicion.idrequisicion
    );
    if (index != -1) {
      this.requisiciones.splice(index, 1);
    }
  }

  verEditarRequisicion(requisicion: Requisicion) {
    // console.log(requisicion);
    this.router.navigateByUrl(
      '/requisiciones/pedidos/' + requisicion.idrequisicion
    );
  }

  ngOnInit(): void {
    this.obtenerRequisiciones();
    this.currentUser = {
      email: this.tokenService.getUser().email,
      idusuario: this.tokenService.getUser().idusuario,
      nombreusuario: this.tokenService.getUser().nombreusuario,
      usuario: this.tokenService.getUser().usuario,
    };
    this.formRequisicion = this.fb.group({
      idrequisicion: new FormControl(),
      numerorequisicion: new FormControl(),
      referencia: new FormControl(null, Validators.required),
      fechaderegistro: new FormControl(),
      usuario: new FormControl(),
      centroDeCostos: new FormControl(),
      observaciones: new FormControl(),
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
        command: () => this.obtenerRequisiciones(),
      },
    ];
  }
}
