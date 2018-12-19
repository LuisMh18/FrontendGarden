import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AgentesService } from '../../../services/agentes/agentes.service';
import { CommonService } from '../../../services/common/common.service';
//confirm
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css'],
  providers: [AgentesService, CommonService, ConfirmationService]
})
export class DetallePedidoComponent implements OnInit {

  public titulo: string;
  public identity;
  public token;
  public loader;
  public titleForm;
  public productos;
  public totalPedido;
  public totalExtras;
  public granTotal;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _agentesService: AgentesService,
    private _commonService: CommonService,
    
  ) {
    this.titulo = 'Detalle del pedido';
  }

  ngOnInit() {  
    console.log('Detalle del pedido');
    this.identity = JSON.parse(localStorage.getItem('identity'));
    this.token = localStorage.getItem('token');
    if (this.identity.rol_id === 3) {
      this._router.navigate(['admin']);
    } else if (this.identity.rol_id === 1) {
      this._router.navigate(['clientes']);
    }
    this.verPedido();
  }

  verPedido(){
    //accedemos a los parametros de la url, con el foreach recorremos todos los paramtros
    this._route.params.forEach((params: Params) => {
      let id_pedido = +params['id_pedido']; //con el + convertimos el id a un entero
      let id_cliente = +params['id_cliente']; //con el + convertimos el id a un entero
      this._agentesService.getPedido(this.token, id_pedido, id_cliente).subscribe(
        response => {
          //this.titleForm = `#${response.datos_cliente.num_pedido}`;
          console.log(response);  
          this.productos = response.producto;
          this.loader = 'hidden';
        }, error => {
          if (error.statusText == 'Unauthorized') {
            this._commonService.token_expired();
          } else {
            console.log('Error 500');
            console.log(<any>error);
    
           this._commonService.msj('error', 'Erro interno del servidor');
    
          }
        }
      );
    });
  }

  verFoto(imagen){
    console.log(imagen);
  }

}//end export class
