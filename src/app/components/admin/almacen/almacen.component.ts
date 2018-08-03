import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//los (..) es para salir de una carpeta, salimos de la carpeta login, luego de la carpeta components y entramos en la carpeta services donde tenemos nuestros servicios
import { AlmacenService } from '../../../services/admin/almacen/almacen.service'; 

import { CommonService } from '../../../services/common/common.service'; 

//confirm
import {ConfirmationService} from 'primeng/api';

//forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css'],
  providers: [AlmacenService, CommonService, ConfirmationService]
})
export class AlmacenComponent implements OnInit {

  public titulo: string;
  public user;
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
  //public productos;
  public paginacion;
  public form: FormGroup;
  public statusForm;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _almacenService: AlmacenService,
    private _commonService: CommonService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
    
  ) {
    this.titulo = 'Almacen';
    //this.productos = _commonService.getArticulos();
    
  }

  //dialog
  display: boolean = false;

  ngOnInit() {
    console.log('Componente de almacen cargado');
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

    this.dataForm = {
      search: "",
      order: "desc",
      estatus:2,
      per_page: this.numberPage ,
    }


    this.form = this.formBuilder.group({
      clave: [
        '', 
       [ 
          Validators.required,
          Validators.minLength(3)
      ]
      ],
      nombre: [
        '', 
        [ 
          Validators.minLength(3), 
          Validators.required  ]
      ],

    });

    this.getAlmacen();
  }


  getAlmacen(){
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
    console.log(this.numberPage);
    this.dataForm.per_page = this.numberPage;
    this.getData(this.token, this.page, this.dataForm);
  }

  


  getData(token, page, data) {
    this._almacenService.getAlmacen(token, page, data).subscribe(
      response => {
        this.dataobjetc = response.data.data;
        this.paginacion = this._commonService.paginacion(response);
        this.pages = this.paginacion[0].pages;
        this.pageCurrent = this.paginacion[0].pageCurrent;
        this.pagePrev = this.paginacion[0].pagePrev;
        this.pNext = this.paginacion[0].pNext;
        this.pageNext = this.paginacion[0].pageNext;
        this.currentPage = this.paginacion[0].currentPage;
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


  //Refrescar tabla
  refresh() {
    this.numberPage = 10;
    this.page = null;
    this.dataForm = {
      search: "",
      order: "desc",
      estatus: 2,
      per_page: this.numberPage,
    }
    this.getAlmacen();
    
  }

  //Eliminar
  delete(id, clave){
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar el almacén ' +clave+' ?',
      header: 'Eliminar Almacén',
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
    this.getAlmacen();
      this._almacenService.deleteAlmacen(this.token, id).subscribe(
        response => {
          this._commonService.msj('success', response.message);
          this.getAlmacen();
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
    this.display = true; 
  }

  changeStatusForm(status){
    this.statusForm = !status;
  }

  //Agregar almacen
  add(formValue: any){
    let data = {
      clave:formValue.clave,
      nombre:formValue.nombre,
      estatus:(this.statusForm == true) ? 1 : 0,
    }
    if(this.form.controls.clave.status == 'INVALID'){
      if(this.form.controls.clave.errors.required){
        this._commonService.msj('error', 'El campo Clave es requerido.');
      }

      if(this.form.controls.clave.errors.minlength){
        this._commonService.msj('error', 'El campo Clave debe de tener al menos 3 caracteres.');
      }
    }

    if(this.form.controls.nombre.status == 'INVALID'){
      if(this.form.controls.nombre.errors.required){
        this._commonService.msj('error', 'El nombre Nombre es requerido.');
      }

      if(this.form.controls.nombre.errors.minlength){
        this._commonService.msj('error', 'El campo Nombre debe de tener al menos 3 caracteres.');
      }
    }

    if(this.form.valid) {
      this._almacenService.addAlmacen(this.token, data).subscribe(
        response => {
          console.log(response);
          if (response.error == 'validate') {
            let data = Object.values(response.errors);
            console.log(data);
            for (let err of data) {
              console.log("validate: " + err[0]);
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
            }
  
          } else if (response.error.statusText == 'Unauthorized') {
            this._commonService.token_expired();
          } else {
              this.display = false; 
              this.form.reset();
              this.getAlmacen();
              this.statusForm = false;
              this._commonService.msj('success', response.message);
          }

        }, error => {
          console.log(<any>error);
        }
      );



    }
    
  }

  

  //Actualizar
  update(id) {
    console.log("Update: " + id);
  }

}
