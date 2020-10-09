// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
// Modelos
import { Requisicion } from "src/app/models/requisicion";
import { Pedido } from "src/app/models/pedido";
// Servicios
import { RequisicionService } from "src/app/services/requisicion.service";
import { PedidoService } from "src/app/services/pedido.service";

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent implements OnInit {
  requisicion: Requisicion;
  pedidos: Pedido[];
  pedido: Pedido;
  selectedPedido: Pedido;

  constructor(
    private requisicionService: RequisicionService,
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  obtenerRequisicion(idrequisition: number){
    this.requisicionService.getOne(idrequisition).subscribe(
      (requisicion: Requisicion) =>{
        console.log(requisicion);
        this.requisicion = requisicion
      }
    )
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idrequisition: number = +params.get('id');
      this.obtenerRequisicion(idrequisition);
    });
  }
}
