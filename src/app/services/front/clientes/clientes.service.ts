import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../../global';

@Injectable()
export class ClientesService {

  public url: string;

  constructor(
    private _http: Http,
  ) {
    this.url = GLOBAL.url;
  }

  //obtener lista de productos u ordenados por categoria
  getData(token, page = null, dataform) {
    let params = JSON.stringify(dataform);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let ruta_page = (page == null) ? 'clientes/index?token=' + token : 'clientes/index?token=' + token + '&page=' + page;
    return this._http.post(this.url + ruta_page, params, options)
      .map(res => res.json());

  }

  //obtener categorias
	getCategories(token) {
	    return this._http.get(this.url+'clientes/categorias?token='+token)
	                     .map(res => res.json());
	 } 

}
