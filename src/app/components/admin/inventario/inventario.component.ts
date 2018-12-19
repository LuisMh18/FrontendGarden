import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { InventarioService } from '../../../services/admin/inventario/inventario.service';
import { CommonService } from '../../../services/common/common.service';
//confirm
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  providers: [InventarioService, CommonService, ConfirmationService]
})
export class InventarioComponent implements OnInit {
  public titulo:String;
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
  public statusForm;
  public titleForm;
  public btnForm;
  public almacen;
  public infoPaginacion;
  public export;
  public loader;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _inventarioService: InventarioService,
    private _commonService: CommonService,
    private confirmationService: ConfirmationService,
  ) {
    this.titulo = "Inventario";
   }

   //dialog
  display: boolean = false;

  ngOnInit() {

    console.log('Componente de inventario cargado');
    this.identity = JSON.parse(localStorage.getItem('identity'));
    this.token = localStorage.getItem('token');
    if (this.identity.rol_id === 2) {
      this._router.navigate(['agentes']);
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
      estatus:0,
      per_page: this.numberPage,
    }

    this.getInventario();
  }//end ngOnInit

  getInventario(){
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
    this._inventarioService.getData(token, page, data).subscribe(
      response => {
        console.log(response);
        if(this.export === false){  
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
      estatus: 0,
      per_page: this.numberPage,
    }
    this.getInventario();
    
  }

  verFoto(imagen){
    console.log(imagen);
  }

}//end export class
