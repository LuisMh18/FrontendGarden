import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

@Injectable()
export class LoginService {
  public url: string;
  public identity;//para guardar los datos del usuario logueado
  public token;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  //login
  signup(user_login): Observable<any> {
    let params = JSON.stringify(user_login);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.url + 'login', params, options)
      .map(res => res.json());

  }

  //cerrar sesion
  logout(token) {
    return this._http.get(this.url + 'logout?token=' + token)
      .map(res => res.json());
  }

  //metodo si el token expira, limpiamos el localStorage y redireccionamos al login
  token_expired() {
    localStorage.setItem('sesion', 'token_expired');//sesion
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.token = null;
    this.identity = null;
    window.location.href = '/login'; //redirigimos al  login
  }

  //obtener datos del usuario
  getIdentity() {
    /* Y ahora, al recuperarlo, convertimos el string nuevamente en un objeto con JSON.parse */
    let identity = JSON.parse(localStorage.getItem('identity'));
    //console.log("identity: " + identity);

    if (identity != "undefined") {
      this.identity = identity;
      //console.log("accdemos al email: " + identity.email);
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  //obtener toen
  getToken() {
    let token = localStorage.getItem('token');
    //console.log("identity:--"+ localStorage.identity);

    if (token != "undefined") {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }

}
