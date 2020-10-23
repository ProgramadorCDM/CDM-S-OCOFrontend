// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
// Modelos
import { OrdenDeCompra } from 'src/app/models/ordendecompra';
import { Pedido } from 'src/app/models/pedido';
import { Recepcion } from 'src/app/models/recepcion';
import { Factura } from 'src/app/models/factura';
import { Usuario } from 'src/app/models/Usuario';
// Servicios
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RecepcionService } from 'src/app/services/recepcion.service';
import { FacturaService } from 'src/app/services/factura.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
// Componentes
import { RecibidosComponent } from './recibidos/recibidos.component';

@Component({
  selector: 'app-ver-compras',
  templateUrl: './ver-compras.component.html',
  styleUrls: ['./ver-compras.component.css'],
})
export class VerComprasComponent implements OnInit {
  orden: OrdenDeCompra = new OrdenDeCompra();
  pedidos: Pedido[];
  selectedPedidos: Pedido[] = [];
  factura: Factura;
  facturas: Factura[] = [];
  currentUser: Usuario;
  items: MenuItem[];
  displayRecepcionModal: boolean = false;
  loadFile: boolean = true;
  file: File;
  formRecepcion: FormGroup;
  es: {
    firstDayOfWeek: number;
    dayNames: string[];
    dayNamesShort: string[];
    dayNamesMin: string[];
    monthNames: string[];
    monthNamesShort: string[];
    today: string;
    clear: string;
  };
  uploadedFiles: any[] = [];

  constructor(
    private ordenDeCompraService: OrdendecompraService,
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute,
    private recepcionService: RecepcionService,
    private facturaService: FacturaService,
    private fb: FormBuilder,
    private tokenService: TokenStorageService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
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
              pedido.pendientes = pedido.cantidadsolicitada - pedido.recibidos;
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

  mostrarDialogoRecibido() {
    this.formRecepcion.reset();
    this.formRecepcion.patchValue({
      fechaderecibido: new Date(),
    });
    this.displayRecepcionModal = true;
  }
  generarRecepcion() {
    let recepcion: Recepcion;
    this.selectedPedidos.forEach((e) => {
      this.formRecepcion.patchValue({
        usuario: this.currentUser,
        pedido: e,
        preciofinal: e.precioinicial * e.pendientes,
        cantidadrecibida: e.pendientes,
      });
      recepcion = this.formRecepcion.value;
      this.guardarRecepcion(recepcion);
    });
  }
  guardarRecepcion(recepcion: Recepcion) {
    this.recepcionService.save(recepcion).subscribe((recepcion: Recepcion) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Pedido Ingresado',
        detail:
          'Recepcion de pedido en la OCO: ' +
          recepcion.pedido.ordenDeCompra.numerodeorden,
      });
      this.cargarDatos();
    });
    this.selectedPedidos = [];
  }

  cargarDatos() {
    this.route.paramMap.subscribe((params) => {
      const idOrden: number = +params.get('id');
      this.obtenerOrdenCompra(idOrden);
      this.obtenerPedidos(idOrden);
      this.obtenerFacturas(idOrden);
    });
  }

  eliminar(id: number) {
    // console.info(id)
    this.facturaService
      .delete(id)
      .subscribe((factura: Factura) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Documento Eliminado',
          detail: 'Documento eliminado correctamente',
        });
        this.facturas.splice(
          this.facturas.findIndex((e) => e.idfactrua == factura.idfactrua),
          1
        );
      });
  }

  ver(id: number) {
    // console.info(id);
    window.open(
      `http://localhost:8080/api/facturas/archivo/${id}`
    );
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.currentUser = {
      email: this.tokenService.getUser().email,
      idusuario: this.tokenService.getUser().idusuario,
      nombreusuario: this.tokenService.getUser().nombreusuario,
      usuario: this.tokenService.getUser().usuario,
    };
    this.formRecepcion = this.fb.group({
      idrecepciondepedido: new FormControl(),
      pedido: new FormControl(),
      fechaderecibido: new FormControl(null, Validators.required),
      cantidadrecibida: new FormControl(),
      preciofinal: new FormControl(),
      factura: new FormControl(null, Validators.required),
      remision: new FormControl(),
      observaciones: new FormControl(),
      usuario: new FormControl(),
      fechaderegistro: new FormControl(),
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

  show(pedido: Pedido) {
    const ref = this.dialogService.open(RecibidosComponent, {
      header: 'Recibidos',
      data: {
        pedido: pedido,
      },
    });
    ref.onClose.subscribe(() => this.cargarDatos());
  }

  uploadFile(event) {
    this.loadFile = false;
    const file = event.target.files[0];
    console.info(file);
    this.factura = {
      fechaderegistro: null,
      formato: 'pdf',
      idfactrua: null,
      nombrearchivo: file.name,
      ordenDeCompra: this.orden,
      recepcionDePedidos: null,
    };
    this.facturaService.saveFile(this.factura, file).subscribe(
      (factura: Factura) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Factura Guardada correctamente',
        });
        this.facturas.push(factura);
        this.loadFile = true;
      },
      (error) => {
        console.error('Error ' + error);
        this.loadFile = true;
      }
    );
  }
}
