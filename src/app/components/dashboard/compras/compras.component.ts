// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
// PrimeNG
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { RequisicionService } from 'src/app/services/requisicion.service';
import { RecepcionService } from 'src/app/services/recepcion.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
// Modelos
import { OrdenDeCompra } from 'src/app/models/ordendecompra';
import { Pedido } from 'src/app/models/pedido';
import { Recepcion } from 'src/app/models/recepcion';
import { Proveedor } from 'src/app/models/proveedor';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
})
export class ComprasComponent implements OnInit {
  ordenes: OrdenDeCompra[];
  orden: OrdenDeCompra;
  ordenDeCompra: OrdenDeCompra;
  selectedOrden: OrdenDeCompra = null;
  proveedores: Proveedor[];
  items: MenuItem[];
  formRequisicion: FormGroup;
  displaySaveEditDialog: boolean = false;
  formOCO: FormGroup;
  formaDePago: SelectItem[];
  currentUser: Usuario = new Usuario();
  es: any;

  constructor(
    private requisicionService: RequisicionService,
    private proveedorService: ProveedorService,
    private pedidoService: PedidoService,
    private ordenService: OrdendecompraService,
    private recepcionService: RecepcionService,
    private tokenService: TokenStorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  obtenerCompras() {
    this.ordenService.getAll().subscribe((ordenesList: OrdenDeCompra[]) => {
      let ordenes: OrdenDeCompra[] = [];
      for (let index = 0; index < ordenesList.length; index++) {
        let orden = ordenesList[index];
        this.pedidoService
          .buscarSolicitadosPorOrden(orden.idordendecompra)
          .subscribe((solicitados: number) => {
            if (solicitados) {
              orden.solicitados = solicitados;
            } else orden.solicitados = 0;
          });
        this.recepcionService
          .buscarRecibidosPorOrden(orden.idordendecompra)
          .subscribe((recibidos: number) => {
            if (recibidos) {
              orden.recibidos = recibidos;
            } else orden.recibidos = 0;
          });
        ordenes.push(orden);
      }
      this.ordenes = ordenes.sort(function (a, b) {
        if (a.numerodeorden < b.numerodeorden) {
          return 1;
        }
        if (a.numerodeorden > b.numerodeorden) {
          return -1;
        }
        return 0;
      });
      console.log(this.ordenes);
    });
  }

  obtenerProveedores() {
    this.proveedorService.getAll().subscribe((array: Proveedor[]) => {
      let proveedores: Proveedor[] = [];
      for (let index = 0; index < array.length; index++) {
        let proveedor = array[index];
        proveedores.push(proveedor);
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

  guardarOCO() {
    this.ordenService
      .save(this.ordenDeCompra)
      .subscribe((ordenDeCompra: OrdenDeCompra) => {
        this.messageService.add({
          severity: 'success',
          summary: 'OCO Generada Correctamente',
          detail: 'Se Genero la OCO Nro. ' + ordenDeCompra.numerodeorden,
        });
        this.displaySaveEditDialog = false;
        this.validarOCO(ordenDeCompra);
      });
  }
  validarOCO(ordenDeCompra: OrdenDeCompra) {
    let index = this.ordenes.findIndex((e) => {
      e.idordendecompra === ordenDeCompra.idordendecompra;
    });
    if (index != -1) {
      this.ordenes[index] = ordenDeCompra;
    } else {
      this.ordenes.push(ordenDeCompra);
    }
  }

  mostrarDialogoGuardar(editar: boolean) {
    this.formOCO.reset();
    if (editar) {
      if (
        this.selectedOrden !== null &&
        this.selectedOrden.idordendecompra !== null
      ) {
        this.formOCO.patchValue(this.selectedOrden);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '!!!Advertencia¡¡¡',
          detail: 'Debe Seleccionar un Proveedor',
        });
        return;
      }
    } else {
      this.ordenDeCompra = new OrdenDeCompra();
      this.selectedOrden = null;
    }
    this.displaySaveEditDialog = true;
  }

  verOrden(orden: OrdenDeCompra) {
    let fileURL: string = null;
    fileURL = 'http://localhost:8080/api/ordenes/pdf/' + orden.idordendecompra;
    window.open(fileURL);
  }

  verEditarOCO(orden: OrdenDeCompra) {
    this.router.navigateByUrl('/compras/ver/' + orden.idordendecompra);
  }

  generarOCO() {
    this.formOCO.patchValue({
      usuario: this.currentUser,
    });
    this.ordenDeCompra = this.formOCO.value;
    this.guardarOCO();
  }

  ngOnInit(): void {
    this.obtenerCompras();
    this.obtenerProveedores();
    this.currentUser = {
      email: this.tokenService.getUser().email,
      idusuario: this.tokenService.getUser().idusuario,
      nombreusuario: this.tokenService.getUser().nombreusuario,
      usuario: this.tokenService.getUser().usuario,
    };
    this.formOCO = this.fb.group({
      idordendecompra: new FormControl(),
      numerodeorden: new FormControl(),
      fechadeorden: new FormControl(null, Validators.required),
      proveedor: new FormControl(null, Validators.required),
      condestinoa: new FormControl(),
      contacto: new FormControl(),
      concargoa: new FormControl(),
      transportador: new FormControl(),
      numerodeguia: new FormControl(),
      formadepago: new FormControl(null, Validators.required),
      usuario: new FormControl(),
      observaciones: new FormControl(),
      requisition: new FormControl(),
      fechaderegistro: new FormControl(),
      fechadeactualizado: new FormControl(),
      iva: new FormControl(),
      exentodeiva: new FormControl(false, Validators.required),
      centrodecostos: new FormControl(null, Validators.required),
      valoriva: new FormControl(),
      solicitados: new FormControl(),
      recibidos: new FormControl(),
    });
    this.formaDePago = [
      { label: 'CREDITO', value: 'CREDITO' },
      { label: 'CONTADO', value: 'CONTADO' },
      { label: 'DEBITO', value: 'DEBITO' },
    ];
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
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        // command: () => this.eliminar(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerCompras(),
      },
    ];
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic',
      ],
      today: 'Hoy',
      clear: 'Borrar',
    };
  }
}
