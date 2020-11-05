// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Modelos
import { Requisicion } from 'src/app/models/requisicion';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/Usuario';
import { OrdenDeCompra } from 'src/app/models/ordendecompra';
import { Proveedor } from 'src/app/models/proveedor';
// Servicios
import { RequisicionService } from 'src/app/services/requisicion.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ProductoService } from 'src/app/services/producto.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { ProveedorService } from 'src/app/services/proveedor.service';

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
  productos: Producto[] = [];
  selectedProductos: Producto[] = [];
  ordenDeCompra: OrdenDeCompra;
  selectecOrdenDeCompra: OrdenDeCompra;
  ordenesDeCompra: OrdenDeCompra[];
  proveedores: Proveedor[] = [];
  formPedido: FormGroup;
  formOCO: FormGroup;
  items: MenuItem[];
  displaySaveEditDialog: boolean = false;
  displaySaveOCO: boolean = false;
  currentUser: Usuario = new Usuario();
  formaDePago: SelectItem[];
  es: any;

  constructor(
    private requisicionService: RequisicionService,
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tokenService: TokenStorageService,
    private productoService: ProductoService,
    private ordenDeCompraService: OrdendecompraService,
    private proveedorService: ProveedorService
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

  obtenerProductos() {
    this.productoService.getAll().subscribe((array: Producto[]) => {
      let productos: Producto[] = [];
      for (let index = 0; index < array.length; index++) {
        let producto = array[index];
        productos.push(producto);
      }
      this.productos = productos.sort(function (a, b) {
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

  obtenerOrdenes() {
    this.ordenDeCompraService.getAll().subscribe((array: OrdenDeCompra[]) => {
      let ordenes: OrdenDeCompra[] = [];
      for (let index = 0; index < array.length; index++) {
        let orden = array[index];
        if (!orden.anulada) {
          ordenes.push(orden);
        }
      }
      this.ordenesDeCompra = ordenes.sort(function (a, b) {
        if (a.numerodeorden < b.numerodeorden) {
          return 1;
        }
        if (a.numerodeorden > b.numerodeorden) {
          return -1;
        }
        return 0;
      });
    });
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
  editarPedido(pedidoS: Pedido) {
    this.pedidoService.save(pedidoS).subscribe((pedido: Pedido) => {
      this.messageService.add({
        severity: 'success',
        summary: '¡actualizado!',
        detail:
          'El producto ' +
          pedido.producto.nombreproducto +
          ' ha sido actualizado correctamente',
        key: 'bc',
      });
      this.displaySaveEditDialog = false;
      this.validarPedido(pedido);
    });
  }
  validarPedido(pedido: Pedido) {
    let index = this.pedidos.findIndex((e) => e.idpedido == pedido.idpedido);
    if (index != -1) {
      this.pedidos[index] = pedido;
    } else {
      this.pedidos.push(pedido);
    }
  }

  mostrarDialogoGuardar(editar: boolean, pedido: Pedido) {
    let hoy = new Date();
    let fechaRequisition = new Date(this.requisicion.fechaderegistro);
    if (
      // fechaRequisition.getFullYear() === hoy.getFullYear() &&
      fechaRequisition.getMonth() === hoy.getMonth() &&
      fechaRequisition.getDate() === hoy.getDate()
    ) {
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
    } else {
      this.messageService.add({
        severity: 'error',
        summary: '¡¡¡Error!!!',
        detail: 'No se puede Agregar pedido Fuera de fecha',
      });
    }
  }

  onGuardar() {
    console.log(this.selectedProductos);
    this.pedido = new Pedido();
    this.pedido.requisition = this.requisicion;
    this.selectedProductos.forEach((e) => {
      this.pedido.producto = e;
      this.guardarPedido();
    });
    // this.pedido = this.formPedido.value;
    // this.guardarPedido();
    this.selectedProductos = [];
  }

  eliminar(pedido: Pedido) {
    if (pedido.ordenDeCompra) {
      this.messageService.add({
        severity: 'error',
        summary: 'ERROR',
        detail: 'No se puede eliminar un producto con OCO',
      });
      return;
    }
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
            this.selectedPedidos = [];
            this.eliminarPedido(result.idpedido);
          });
      },
    });
  }
  eliminarPedido(idpedido: number) {
    let index = this.pedidos.findIndex((e) => e.idpedido == idpedido);
    console.log(index);
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

  onRowEditSave(pedido: Pedido) {
    if (pedido.ordenDeCompra) {
      this.messageService.add({
        severity: 'error',
        summary: 'ERROR',
        detail: 'No se puede editar un producto con OCO',
      });
      return;
    }
    if (pedido.precioinicial > 0 && pedido.cantidadsolicitada > 0) {
      this.editarPedido(pedido);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La cantidad y el precio debe ser mayor a 0',
      });
    }
  }

  onRowOCOSelect(event) {
    let ordenDeCompra: OrdenDeCompra = event.data
    this.messageService.add({
      severity: 'info',
      summary: `Orden ${ordenDeCompra.numerodeorden} Seleccionada`,
      detail: `Proveedor Orden  ${ordenDeCompra.proveedor.nombreprovee}`,
    });
    this.selectedPedidos.forEach((e) => {
      e.ordenDeCompra = ordenDeCompra;
      this.editarPedido(e);
    });
    this.selectedPedidos = [];
  }

  generarOCO() {
    this.formOCO.patchValue({
      usuario: this.currentUser,
      requisition: this.requisicion,
    });
    this.ordenDeCompra = this.formOCO.value;
    this.guardarOCO();
  }
  guardarOCO() {
    this.ordenDeCompraService
      .save(this.ordenDeCompra)
      .subscribe((ordenDeCompra: OrdenDeCompra) => {
        this.messageService.add({
          severity: 'success',
          summary: 'OCO Generada Correctamente',
          detail: 'Se Genero la OCO Nro. ' + ordenDeCompra.numerodeorden,
        });
        this.selectedPedidos.forEach((e) => {
          e.ordenDeCompra = ordenDeCompra;
          this.editarPedido(e);
        });
      });
    this.selectedPedidos = [];
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerProveedores();
    this.route.paramMap.subscribe((params) => {
      const idrequisition: number = +params.get('id');
      this.obtenerRequisicion(idrequisition);
    });
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
