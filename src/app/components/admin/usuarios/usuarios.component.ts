import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UsuariosService } from '../../../services/admin/usuarios/usuarios.service';
import { CommonService } from '../../../services/common/common.service';
//confirm
import {ConfirmationService} from 'primeng/api';
//forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [UsuariosService, CommonService, ConfirmationService]
})
export class UsuariosComponent implements OnInit {
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
  public titleForm;
  public btnForm;
  public usuario;
  public infoPaginacion;
  public export;
  public loader;
  public roles;
  public viewImage;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuariosService: UsuariosService,
    private _commonService: CommonService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {
    this.titulo = 'Usuarios';
   }

  //dialog
  display: boolean = false;

  ngOnInit() {

    this.identity = JSON.parse(localStorage.getItem('identity'));
    this.token = localStorage.getItem('token');
    if (this.identity.rol_id === 2) {
      this._router.navigate(['agentes']);
    } else if (this.identity.rol_id === 1) {
      this._router.navigate(['clientes']);
    }

    this.usuario = {
      id:"",
      nombre:"",
      paterno:"",
      materno:"",
      usuario:"",
      email:"",
      password:"",
      usuario_r:"",
      rol:"0",
      imagen:"",
     }

    this.page = null;//para el numero de pagina de la paginacion
    this.numberPage = 10; //select para seleccionar el numero de registros de ver por pagina 
    this.export = false;
    this.loader = '';

    this.dataForm = {
      search: "",
      order: "desc",
      rol:0,
      per_page: this.numberPage ,
    }

    //reglas de validacion
    this.form = this.formBuilder.group({
      nombre: [
        '', 
        [ 
          Validators.minLength(3), 
          Validators.required  ]
        ],
        
        paterno: [
          '', 
         [ 
            Validators.required,
            Validators.minLength(3)
         ]
        ],
        materno: [
          '', 
         [ 
            Validators.required,
            Validators.minLength(3)
         ]
        ],
        usuario: [
          '', 
         [ 
            Validators.required,
            Validators.minLength(3)
         ]
        ],
        email: [
          '', 
         [ 
            Validators.required,
            Validators.minLength(3)
         ]
        ],
        password: [
          '', 
         [ 
            Validators.required,
            Validators.minLength(3)
         ]
        ],
        password_r: [
          '', 
         [ 
            Validators.required,
            Validators.minLength(3)
         ]
        ],
        rol: [
          '', 
         [ 
            Validators.required,
            Validators.minLength(3)
         ]
        ],
        imagen: [
          '', 
         [ 
            Validators.required,
            Validators.minLength(3)
         ]
        ],
    });

    this.getUsuarios();
  }

  getUsuarios(){
    if (this.token != null) {
      this.getData(this.token, this.page, this.dataForm);
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
    this._usuariosService.getData(token, page, data).subscribe(
      response => {
        console.log("response");
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
          this.confirmexportdata(response.data.data);
          //this.dataForm.indexOf(4);
          /*this.dataForm = {
            search: "",
            order: "desc",
            rol: 0,
            per_page: this.numberPage,
          }*/
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

  getRol(token){
    this._usuariosService.getRol(token).subscribe(
      response => {
        console.log(response);
        this.roles = response.data;
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


  getAll(token) {
    this._usuariosService.getAll(token).subscribe(
      response => {
        this._commonService.exportdata(response.data, ["Id", "Nombre", "Usuario", "Email", "Rol", "Fecha"], "Usuarios_");
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
      let dataFormExport = {
        search: this.dataForm.search,
        order: this.dataForm.order,
        rol: this.dataForm.rol,
        per_page: this.dataForm.per_page,
        export: 1,
      }
      this.getData(this.token, this.page, dataFormExport);
    } else {
      this._commonService.exportdata(data, ["Id", "Nombre", "Usuario", "Email", "Rol", "Fecha"], "Usuarios_");
      this.export = false;
    }
    

  }

  view(imagen){
    console.log(imagen);
    if(imagen != null){
      this.viewImage = imagen;
      console.log(this.viewImage);
      //this.display = true;
    } else {
      this._commonService.msj('info', 'Sin imagen!');
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
      rol: 0,
      per_page: this.numberPage,
    }
    this.getUsuarios(); 
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
      this.getUsuarios();
       /* this._usuariosService.delete(this.token, id).subscribe(
          response => {
            this._commonService.msj('success', response.message);
            this.getUsuarios();
          }, error => {
            if (error.statusText == 'Unauthorized') {
              this._commonService.token_expired();
            } else {
              console.log('Error 500');
            console.log(<any>error);
            this._commonService.msj('error', 'Erro interno del servidor');
    
            }
          }
        );*/
  
    }
  
  
    showDialog(){ 
      this.getRol(this.token);
      this.form.reset();
      this.display = true; 
      this.titleForm = "Agregar Usuario";
      this.btnForm = "Agregar";   
      this.usuario.rol = 0;
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


    submit(formValue: any, action){
      console.log(formValue)
      if(action === 'Agregar'){
        //this.add(formValue);
      } else {
       // this.update(formValue);
      }
      
    }


      //edit
  edit(id) {
    this.form.reset();
    this.display = true; 
    this.titleForm = "Editar Usuario";;
    this.btnForm = "Actualizar";
    this.getRol(this.token);

    this._usuariosService.edit(this.token, id).subscribe(
      response => {
         this.usuario = {
          id:response.data.id,
          nombre:response.data.nombre,
          paterno:response.data.paterno,
          materno:response.data.materno,
          usuario:response.data.usuario,
          email:response.data.email,
          password:"",
          usuario_r:"",
          rol:response.data.rol_id,
          imagen:response.data.imagen,
         }

      }, error => {
        if(error.statusText == 'Unauthorized'){
          this._commonService.token_expired();
        } else {
          console.log(<any>error);
        }
      }
    );
  }

}
