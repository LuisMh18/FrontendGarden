import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AgentesService } from '../../services/agentes/agentes.service';
import { CommonService } from '../../services/common/common.service';
//confirm
import {ConfirmationService} from 'primeng/api';
//forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.css'],
  providers: [AgentesService, CommonService, ConfirmationService]
})
export class AgentesComponent implements OnInit {

  public titulo: string;
  public identity;
  public token;
  public data;
  public dataobjetc;
  public pages;
  public page;
  public pageNext;
  public pNext;
  public pageCurrent;
  public pagePrev;
  public currentPage;
  public dataForm;
  public numberPage;
  public paginacion;
  public form: FormGroup;
  public statusForm;
  public titleForm;
  public btnForm;
  public almacen;
  public infoPaginacion;
  public export;
  public loader;
  public totalPedido;
  public totalExtras;
  public granTotal;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _agentesService: AgentesService,
    private _commonService: CommonService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
    
  ) {
    this.titulo = 'Agentes';
  }

  //dialog
  display: boolean = false;

  ngOnInit() {
    console.log('Componente de agentes cargado');
    this.identity = JSON.parse(localStorage.getItem('identity'));
    this.token = localStorage.getItem('token');
    if (this.identity.rol_id === 3) {
      this._router.navigate(['admin']);
    } else if (this.identity.rol_id === 1) {
      this._router.navigate(['clientes']);
    }


    this.page = null;//para el numero de pagina de la paginacion
    this.numberPage = 10; //select para seleccionar el numero de registros de ver por pagina 
    this.statusForm = false; //estatus del formulario
    this.export = false;
    this.loader = '';

    this.dataForm = {
      search: "",
      order: "desc",
      estatus:4,
      per_page: this.numberPage,
    }

    this.getPedidosAgente();
  }


getPedidosAgente(){
  if (this.token != null) {
    this.getData(this.token, this.page, this.dataForm);
    console.log("Llamamos al metododo");
  }
}


nPage(page) {
  if (page != 'null') {
    this.loader = '';
    this.page = page;
    this.getData(this.token, page, this.dataForm);
  }

}

//search
onSearch() {
  this.loader = '';
  this.getData(this.token, this.page = null, this.dataForm);
}

//Mostrar numero de paginas
onChange() {
  this.loader = '';
  console.log(this.numberPage);
  this.dataForm.per_page = this.numberPage;
  this.getData(this.token, this.page, this.dataForm);
}


getData(token, page, data) {
  this._agentesService.getData(token, page, data).subscribe(
    response => {
      if(this.export === false){
        console.log(response);

        let pedido = 0;
        let extras = 0;
        let _objects = response.data.data;
        _objects.forEach(element => {
          console.log(element.total);
          pedido += element.total;
          extras += element.extra_total;
        });
        this.totalPedido = pedido;
        this.totalExtras = extras;
        this.granTotal = pedido + extras;

        this.infoPaginacion = `Mostrando registros del ${response.data.from} al ${response.data.to} de un total de ${response.data.total} registros`;
        this.dataobjetc = response.data.data;
        this.paginacion = this._commonService.paginacion(response);
        this.pages = this.paginacion[0].pages;
        this.pageCurrent = this.paginacion[0].pageCurrent;
        this.pagePrev = this.paginacion[0].pagePrev;
        this.pNext = this.paginacion[0].pNext;
        this.pageNext = this.paginacion[0].pageNext;
        this.currentPage = this.paginacion[0].currentPage;
        this.loader = 'hidden';
      } else {
        //this.confirmexportdata(response.data.data);
      }
      
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

}


  //Refrescar tabla
  refresh() {
    this.loader = '';
    this.numberPage = 10;
    this.page = null;
    this.dataForm = {
      search: "",
      order: "desc",
      estatus: 4,
      per_page: this.numberPage,
    }
    this.getPedidosAgente();
    
  }

}//end export class