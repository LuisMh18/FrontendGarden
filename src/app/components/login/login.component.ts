import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//los (..) es para salir de una carpeta, saimos de la carpeta login, luego de la carpeta components y entramos en la carpeta services donde tenemos nuestros servicios
import { LoginService } from '../../services/login/login.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  public titulo: string;
  public user;
  public identity;
  public token;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
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

  }


  onSubmit() {
    //console.log(this.user); 
    this._loginService.signup(this.user).subscribe(
      response => {
        //console.log(response);
        if (response.error == 'validate') {

          //converitmos el objeto en un array para acceder mas facil  a sus valores
          let data = Object.values(response.errors);

          console.log(data);

          for (let err of data) {
            console.log("validate: " + err[0]);
            //this._notif('error', `<div class="font_notif">${err[0]}</div>`);
          }

        } else {
          if (response.error == true) {
            //this._notif('error', response.message);
            console.log(response.message);
          } else {
            //this._notif('success', 'Te has logueado correctamente!');
            console.log('Te has logueado correctamente!');
            //console.log(response);
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
