import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//los (..) es para salir de una carpeta, saimos de la carpeta login, luego de la carpeta components y entramos en la carpeta services donde tenemos nuestros servicios
import { LoginService } from '../../services/login/login.service'; 

import { CommonService } from '../../services/common/common.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService, CommonService]
})
export class LoginComponent implements OnInit {
  public titulo: string;
  public user;
  public identity;
  public token;
  public form: FormGroup;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService,
    private _commonService: CommonService,
    private formBuilder: FormBuilder
  ) {
    this.titulo = 'Inicia Sesión';
   }

  ngOnInit() {
    console.log('Login Cargado');
    this.user = {
      "email": "",
      "password": ""
    }

    this.token = localStorage.getItem('token');

    //comprobamos si existe la variable token quiere decir que estamos logueados y restringimos el acceso al login
    if (this.token){
      window.history.back();
    }

    //reglas de validacion
    this.form = this.formBuilder.group({
      email: [
        '', 
       [ 
         Validators.required,
         Validators.email
       ]
      ],
      password: [
        '', 
        [ 
          Validators.required,
          Validators.minLength(6)
        ]
      ],

    });

  }


  onSubmit() {

    this.validate();

    if(this.form.valid) {
      $.mpb("show",{value: [0,100],speed: 8});
      let interval = setInterval(() => {
        $.mpb("show",{value: [0,100],speed: 8});
      }, 1200);
  
      document.getElementById("acceder").className = "btn btn-info btn-block disabled";
      //console.log(this.user); 
  
      this._loginService.signup(this.user).subscribe(
        response => {
          //console.log(response);
          document.getElementById("acceder").className = "btn btn-info btn-block";
  
          
          clearInterval(interval);
          setTimeout(() => {          
              $(".mpb").fadeOut(200,function(){
                  $(this).remove();
              });
        }, 500);
          if (response.error == 'validate') {
            //converitmos el objeto en un array para acceder mas facil  a sus valores
            let data = Object.values(response.errors);
            console.log(data);
            for (let err of data) {
              console.log("validate: " + err[0]);
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
            }
  
          } else {
            if (response.error == true) {
              document.getElementById("form-group-email").className = "form-group has-feedback has-error";
              document.getElementById("email").className = "form-control input-error";
              document.getElementById("icon_email").className = "glyphicon glyphicon-remove form-control-feedback";

              document.getElementById("form-group-password").className = "form-group has-feedback has-error";
              document.getElementById("password").className = "form-control input-error";
              document.getElementById("icon_password").className = "glyphicon glyphicon-remove form-control-feedback";

              this._commonService.msj('error', response.message);
            } else {
              document.getElementById("form-group-email").className = "form-group has-feedback has-success";
              document.getElementById("email").className = "form-control input-success";
              document.getElementById("icon_email").className = "glyphicon glyphicon-ok form-control-feedback";

              document.getElementById("form-group-password").className = "form-group has-feedback has-success";
              document.getElementById("password").className = "form-control input-success";
              document.getElementById("icon_password").className = "glyphicon glyphicon-ok form-control-feedback";
              this._commonService.msj('success', 'Te has logueado correctamente!');

              this.token = response.token;
              this.identity = response.data;
              // como es un objeto lo convertimos en una cadena de texto con JSON.stringify para poder guardarlo en el local storage
              localStorage.setItem('identity', JSON.stringify(this.identity));
              localStorage.setItem('token', this.token);
              /* Rol de usuarios ------
              * 1 - Cliente
              * 2 - Agente
              * 3 - Administrador
              */
              //comprobamos el rol del usuario
              if (this.identity.rol_id === 3){
                console.log(this.identity.rol_id);
                console.log('Eres administrador');
                window.location.href = 'admin';
              } else if (this.identity.rol_id === 2){
                console.log(this.identity.rol_id);
                console.log('Eres agente');
                window.location.href = 'agentes';
              } else {
                console.log(this.identity.rol_id);
                console.log('Eres cliente');
                window.location.href = 'clientes';
              }
              //this._router.navigate(['/']); //redirigimos a la home
              //window.location.href = 'reservations';
            }
  
          }
  
        }, error => {
          console.log(<any>error);
        }
      );
    }
     
  }


  validate(){
    for (const field in this.form.controls) { // 'field' is a string
      const control = this.form.get(field); // 'control' is a FormControl

      let form_input = document.getElementById(field);
      let form_group = document.getElementById("form-group-"+field);
      let form_icon = document.getElementById("icon_"+field); 

      if(control.status == 'INVALID'){

        form_group.className = "form-group has-feedback has-error";
        form_input.className = "form-control input-error";
        form_icon.className = "glyphicon glyphicon-remove form-control-feedback";

        if(control.errors.required){
          if(field == 'password'){
            this._commonService.msj('error', `El campo contraseña es requerido.`);
          } else {
            this._commonService.msj('error', `El campo ${field} es requerido.`);
          }
        }

        if(control.errors.minlength){
          this._commonService.msj('error', `El campo contraseña debe de tener al menos 6 caracteres.`);
        }
  
        if(control.errors.email){
          let erros_email = Object.values(control.errors);
          if(erros_email.length == 1){
            this._commonService.msj('error', `El formato del ${field} es inválido.`);
          }
        }
      } else {
        form_group.className = "form-group has-feedback has-success";
        form_input.className = "form-control input-ok";
        form_icon.className = "glyphicon glyphicon-ok form-control-feedback";
      }

    }
  }

}
