import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login/login.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService]
})
export class AppComponent {
  title = 'Garden Central';
  public identity;
  public token;
  public class_container;
  public nav_menu;

  constructor(
    private _loginService: LoginService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.identity = this._loginService.getIdentity();
    this.token = this._loginService.getToken();
  }

  ngOnInit() {
    console.log('componente principal cargado');
    //console.log("rol del usuario: " + this.identity);
    //console.log('token-: ' + this.token);
    if(this.token == null){
      //console.log("Logueate");
      this._router.navigate(['login']);
      this.class_container = 'login-container';
    } else {
      //console.log("Estas logueado");
      //console.log("rol del usuario: " + this.identity.rol_id);
      this.class_container = 'page-container';
    }

    this.nav_menu = (this.token != null && this.identity.rol_id === 3) ? 'page-content' : 'page-content2';

    //filtros
    localStorage.setItem("order", JSON.stringify(0));
    localStorage.setItem("estatus", JSON.stringify(2));//estatud por defecto 2 para traer todos
    localStorage.setItem("search", JSON.stringify(0));
    
  }

  //cerrar sesions
  logout() {
    this.token = this._loginService.getToken(); //obtenemos el token
    this._loginService.logout(this.token); //llamamos al metodo para cerrar la sesion

    this._loginService.logout(this.token).subscribe(
      response => {
        //console.log(response);
        localStorage.setItem('sesion', 'finished');//sesion
        localStorage.removeItem('token');
        localStorage.removeItem('identity');
        this.token = null;
        this.identity = null;
        //this._router.navigate(['/']);
        window.location.href = '/login'; //redirigimos al  login
      }, error => {
        if (error.statusText == 'Unauthorized') { //si la sesion ah expirado
          this._loginService.token_expired();
        } else {
          console.log(<any>error);
        }
      }
    );


  }

}
