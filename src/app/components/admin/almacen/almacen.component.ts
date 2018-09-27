import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//los (..) es para salir de una carpeta, salimos de la carpeta login, luego de la carpeta components y entramos en la carpeta services donde tenemos nuestros servicios
import { AlmacenService } from '../../../services/admin/almacen/almacen.service';
import { CommonService } from '../../../services/common/common.service';
//confirm
import {ConfirmationService} from 'primeng/api';
//forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//declare var jQuery:any;
//declare var $:any;

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css'],
  providers: [AlmacenService, CommonService, ConfirmationService]
})
export class AlmacenComponent implements OnInit {

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
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _almacenService: AlmacenService,
    private _commonService: CommonService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
    
  ) {
    this.titulo = 'Almacén';
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

    //$("a").attr("href", "javascript: void(0);" ); 
    /*setTimeout(() => { 
      $("a").removeAttr("href");
   }, 1000);
    $("a").attr("href", "javascript: void(0);" );
    $("a").html("hola ---" ); */

    this.almacen = {
     id:"",
     clave:"",
     nombre:"",
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
    this._almacenService.getData(token, page, data).subscribe(
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
    this._almacenService.getAll(token).subscribe(
      response => {
        this._commonService.exportdata(response.data, ["Id", "Clave", "Nombre", "Estatus", "Fecha"], "Almacén_");
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
      this._commonService.exportdata(data, ["Id", "Clave", "Nombre", "Estatus", "Fecha"], "Almacén_");
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
      this._almacenService.delete(this.token, id).subscribe(
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
    this.form.reset();
    this.statusForm = false;
    this.display = true; 
    this.titleForm = "Agregar Almacén";
    this.btnForm = "Agregar";
 
  }

  close(event){
    console.log(event.target);
    if (event.target.className === "pi pi-times") {
      this.clearForm();
    } 
}

  closeModal(){
    this.clearForm();
    this.display = false;
  }


  //limpiamos los msjs de error oh de success
  clearForm(){
    for (const field in this.form.controls) { // 'field' is a string
      let form_group = document.getElementById(field);
      let form_icon = document.getElementById("icon_"+field); 
      form_group.className = "form-group";
      form_icon.className = "";
    }
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
    this.almacen = {
      clave:formValue.clave,
      nombre:formValue.nombre,
      estatus:(this.statusForm == true) ? 1 : 0,
    }
    
    this.validate();
 
    if(this.form.valid) {
      this._almacenService.add(this.token, this.almacen).subscribe(
        response => {
          if (response.error == 'validate') {
            let data = Object.values(response.errors);
            for (let err of data) {
              console.log("validate: " + err[0]);
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
            }
  
          } else if (response.error.statusText == 'Unauthorized') {
            this._commonService.token_expired();
          } else {
              this.display = false; 
              this.form.reset();
              this.clearForm();
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

  

  //edit
  edit(id) {
    this.form.reset();
    this.display = true; 
    this.titleForm = "Editar Almacén";;
    this.btnForm = "Actualizar";

    this._almacenService.edit(this.token, id).subscribe(
      response => {
        this.almacen = {
          id:response.data.id,
          clave:response.data.clave,
          nombre:response.data.nombre,
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

    this.almacen = {
      id:this.almacen.id,
      clave:formValue.clave,
      nombre:formValue.nombre,
      estatus:(this.statusForm === true) ? 1 : 0,
    }

    this.validate();

    if(this.form.valid) {
      this._almacenService.update(this.token, this.almacen).subscribe(
        response => {
          
          if (response.error == 'validate') {
            let data = Object.values(response.errors);
            for (let err of data) {
              console.log("validate: " + err[0]);
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
            }
  
          } else if (response.error == true){
            this._commonService.msj('warn', response.message);
          } else if (response.error.statusText == 'Unauthorized') {
            this._commonService.token_expired();
          } else {
              this.display = false; 
              this.form.reset();
              this.clearForm();
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

  validate(){
    this._commonService.validateForm(this.form);
  }



}
