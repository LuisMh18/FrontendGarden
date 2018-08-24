import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


//los (..) es para salir de una carpeta, salimos de la carpeta login, luego de la carpeta components y entramos en la carpeta services donde tenemos nuestros servicios
import { ClientesService } from '../../../services/front/clientes/clientes.service';
import { CommonService } from '../../../services/common/common.service';
//confirm
import {ConfirmationService} from 'primeng/api';
//forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClientesService, CommonService, ConfirmationService]
})
export class ClientesComponent implements OnInit {

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
  public selectCategoria = '0';
  public paginacion;
  public form: FormGroup;
  public statusForm;
  public titleForm;
  public btnForm;
  public productos;
  //public infoPaginacion;
  public export;
  public loader;
  public infoProducts;
  //dataView
  public selectedProduct;
  public sortOptions = [];//opciones del select categorias
  public numberCart = 0;//numero de compras que tenemos en el carrito
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _clientesService: ClientesService,
    private _commonService: CommonService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {
    this.titulo = 'Clientes';
  }

  //dialog
  display: boolean = false;

  ngOnInit() {
    console.log('Componente de clientes cargado');
    this.identity = JSON.parse(localStorage.getItem('identity'));
    this.token = localStorage.getItem('token');
    //console.log(this.identity);
    if (this.identity.rol_id === 2) {
      this._router.navigate(['agentes']);
    } else if(this.identity.rol_id === 3) {
      this._router.navigate(['admin']);
    }

    this.page = null;//para el numero de pagina de la paginacion
    this.loader = '';

    this.dataForm = {
      search: "",
      categoria_id:this.selectCategoria
    }
  
    this.getProductos();
    this.getCategories(this.token);
  }


  getProductos(){
      if (this.token != null) {
        this.getData(this.token, this.page, this.dataForm);
      }
   }


   nPage(page) {
    if (page != 'null') {
      this.page = page;
      this.loader = '';
      this.getData(this.token, page, this.dataForm);
    }

  }

  //search
  onSearch() {
    //this.loader = '';
    console.log(this.dataForm);
    this.getData(this.token, this.page = null, this.dataForm);
  }

  //Cambiar de categoria
  onChange() {
    this.dataForm.categoria_id = this.selectCategoria;
    this.getData(this.token, this.page, this.dataForm);
  }


     getData(token, page, data) {
       console.log(data);
      this._clientesService.getData(token, page, data).subscribe(
        response => {
            this.dataobjetc = response.data.data;
            console.log(this.dataobjetc.length);
            if(this.dataobjetc.length === 0){
              this.infoProducts = "No se encontraron productos";
            } else {
              this.infoProducts = "";
              //this.infoPaginacion = `Mostrando registros del ${response.data.from} al ${response.data.to} de un total de ${response.data.total} registros`;
              this.paginacion = this._commonService.paginacion(response);
              this.pages = this.paginacion[0].pages;
              this.pageCurrent = this.paginacion[0].pageCurrent;
              this.pagePrev = this.paginacion[0].pagePrev;
              this.pNext = this.paginacion[0].pNext;
              this.pageNext = this.paginacion[0].pageNext;
              this.currentPage = this.paginacion[0].currentPage;
              this.loader = 'hidden';
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


   getCategories(token) {
    this._clientesService.getCategories(token).subscribe(
      response => {
        this.sortOptions.push({label: "Todo", value: "0"});
          for (let categoria of response.data) {
            this.sortOptions.push({label: categoria.categoria, value: categoria.id});
          }

         // console.log(this.sortOptions);

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

  showProduct(obj) {
        this.selectedProduct = obj;
       console.log(obj);
       console.log(this.selectedProduct.clave);
       this.display = true;
    }


}