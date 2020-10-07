// Angular
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { RequisicionService } from 'src/app/services/requisicion.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
// Modelos
import { Requisicion } from 'src/app/models/requisicion';
import { Pedido } from 'src/app/models/pedido';

@Component({
  selector: 'app-requisiciones',
  templateUrl: './requisiciones.component.html',
  styleUrls: ['./requisiciones.component.css'],
})
export class RequisicionesComponent implements OnInit {
  requisiciones: Requisicion[];
  requicicion: Requisicion;
  selectedRequisicion: Requisicion;
  items: MenuItem[];
  formRequisicion: FormGroup;
  displaySaveEditDialog: boolean = false;

  constructor(
    private requisicionService: RequisicionService,
    private pedidoService: PedidoService,
    private ordenService: OrdendecompraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
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
            let pedidos: Pedido []=[]
            data.forEach((e)=>{
              this.pedidoService.obtenerPedido(e).subscribe((p:Pedido)=>{
                if (p.ordenDeCompra !== null) {
                  pedidos.push(p)
                }
                requisicion.pendientes = data.length - pedidos.length;
              })
            })
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

  ngOnInit(): void {
    this.obtenerRequisiciones();
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
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        // command: () => this.eliminar(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerRequisiciones(),
      },
    ];
  }
}
