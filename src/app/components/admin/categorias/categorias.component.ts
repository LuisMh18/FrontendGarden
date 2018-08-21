import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoriasService } from '../../../services/admin/categorias/categorias.service';
import { CommonService } from '../../../services/common/common.service';
import {ConfirmationService} from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [CategoriasService, CommonService, ConfirmationService]
})
export class CategoriasComponent implements OnInit {
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
  public categorias;
  public infoPaginacion;
  public export;
  public loader;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoriasService: CategoriasService,
    private _commonService: CommonService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder

  ) {
    this.titulo = 'Categorías';
  }

  //dialog
  display: boolean = false;

  ngOnInit() {
    console.log('Componente de categorias cargado');
    this.identity = JSON.parse(localStorage.getItem('identity'));
    this.token = localStorage.getItem('token');
    if (this.identity.rol_id === 2) {
      this._router.navigate(['agentes']);
    } else if (this.identity.rol_id === 1) {
      this._router.navigate(['clientes']);
    }

    this.categorias = {
      id:"",
      categoria:"",
      estatus:0
    }

    this.page = null;//para el numero de pagina de la paginacion
    this.numberPage = 10; //select para seleccionar el numero de registros de ver por pagina
    this.statusForm = false; //estatus del formulario
    this.export = false;
    this.loader = '';

    this.dataForm = {
      search: "",
      order: "desc",
      estatus:2,
      per_page: this.numberPage ,
    }


    //reglas de validacion
    this.form = this.formBuilder.group({
      categoria: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

    });

    this.getCategoria();
  }//end OnInit



  getCategoria(){
    if (this.token != null) {
      this.getData(this.token, this.page, this.dataForm);
    }
  }

  nPage(page) {
    if (page != 'null') {
      this.page = page;
      this.getData(this.token, page, this.dataForm);
    }

  }

  //search
  onSearch() {
    this.getData(this.token, this.page = null, this.dataForm);
  }

  //Mostrar numero de paginas
  onChange() {
    this.dataForm.per_page = this.numberPage;
    this.getData(this.token, this.page, this.dataForm);
  }


  getData(token, page, data) {
    this._categoriasService.getData(token, page, data).subscribe(
      response => {
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
          this.confirmexportdata(response.data.data);
        }

      }, error => {
        if (error.statusText == 'Unauthorized') {
          this._commonService.token_expired();
        } else {
          console.log('Error 500');
          console.log(<any>error);
          //llamamos nuevamente
          //this.getReservations();


          /*setInterval(() => {
           this.getReservations();
         }, 5000);*/

          this._commonService.msj('error', 'Erro interno del servidor');
          /*setInterval(() => {
            location.reload();
          }, 1000);*/



        }
      }
    );

  }

  getAll(token) {
    this._categoriasService.getAll(token).subscribe(
      response => {
        this._commonService.exportdata(response.data, ["Id", "Categoría", "Estatus", "Fecha"], "Categorías_");
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

  exportdata(d){
    if(d === 1){
      this.getAll(this.token);
    } else {
      this.confirmexportdata(undefined);
    }
  }



  confirmexportdata(data){
    if(data === undefined){
      this.export = true;
      this.getData(this.token, this.page, this.dataForm);
    } else {
      this._commonService.exportdata(data, ["Id", "Categoría", "Estatus", "Fecha"], "Categorías_");
      this.export = false;
    }


  }


  //Refrescar tabla
  refresh() {
    this.loader = '';
    this.numberPage = 10;
    this.page = null;
    this.dataForm = {
      search: "",
      order: "desc",
      estatus: 2,
      per_page: this.numberPage,
    }
    this.getCategoria();

  }

  //Eliminar
  delete(id, categoria){
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar la categoría ' +categoria+' ?',
      header: 'Eliminar Categoría',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.confirmdelete(id);
      },
      reject: () => {
        //console.log("no");
      }
    });
  }

  confirmdelete(id){
    this.getCategoria();
    this._categoriasService.delete(this.token, id).subscribe(
      response => {
        this._commonService.msj('success', response.message);
        this.getCategoria();
      }, error => {
        if (error.statusText == 'Unauthorized') {
          this._commonService.token_expired();
        } else {
          console.log('Error 500');
          console.log(<any>error);
          this._commonService.msj('error', 'Erro interno del servidor');
          /* setInterval(() => {
             location.reload();
           }, 1000); */

        }
      }
    );

  }


  showDialog(){
    this.form.reset();
    this.statusForm = false;
    this.display = true;
    this.titleForm = "Agregar Categoría";
    this.btnForm = "Agregar";
  }

  changeStatusForm(status){
    this.statusForm = !status;
  }

  //add and update
  submit(formValue: any, action){

    if(action === 'Agregar'){
      this.add(formValue);
    } else {
      this.update(formValue);
    }

  }

  //Agregar
  add(formValue){
    this.categorias = {
      categoria:formValue.categoria,
      estatus:(this.statusForm == true) ? 1 : 0,
    }

    this.validate();

    if(this.form.valid) {
      this._categoriasService.add(this.token, this.categorias).subscribe(
        response => {
          if (response.error == 'validate') {
            let data = Object.values(response.errors);
            for (let err of data) {
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
            }

          } else if (response.error.statusText == 'Unauthorized') {
            this._commonService.token_expired();
          } else {
            this.display = false;
            this.form.reset();
            this.getCategoria();
            this.statusForm = false;
            this._commonService.msj('success', response.message);
          }

        }, error => {
          console.log(<any>error);
        }
      );



    }
  }



  //edit
  edit(id) {
    this.form.reset();
    this.display = true;
    this.titleForm = "Editar Categoría";;
    this.btnForm = "Actualizar";

    this._categoriasService.edit(this.token, id).subscribe(
      response => {
        this.categorias = {
          id:response.data.id,
          categoria:response.data.categoria,
          estatus:response.data.estatus
        }
        this.statusForm = (response.data.estatus === 1) ? true : false;

      }, error => {
        if(error.statusText == 'Unauthorized'){
          this._commonService.token_expired();
        } else {
          console.log(<any>error);
        }
      }
    );
  }


  update(formValue){

    this.categorias = {
      id:this.categorias.id,
      categoria:formValue.categoria,
      estatus:(this.statusForm === true) ? 1 : 0
    }

    this.validate();

    if(this.form.valid) {
      this._categoriasService.update(this.token, this.categorias).subscribe(
        response => {
          if (response.error == 'validate') {
            let data = Object.values(response.errors);
            for (let err of data) {
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
            }

          } else if (response.error == true){
            this._commonService.msj('warn', response.message);
          } else if (response.error.statusText == 'Unauthorized') {
            this._commonService.token_expired();
          } else {
            this.display = false;
            this.form.reset();
            this.getCategoria();
            this.statusForm = false;
            this._commonService.msj('success', response.message);
          }

        }, error => {
          console.log(<any>error);
        }
      );



    }

  }

  validate(){
    if(this.form.controls.categoria.status == 'INVALID'){
      if(this.form.controls.categoria.errors.required){
        this._commonService.msj('error', 'El campo Categoría es requerido.');
      }

      if(this.form.controls.clave.errors.minlength){
        this._commonService.msj('error', 'El campo Categoría debe de tener al menos 3 caracteres.');
      }
    }

  }


}
