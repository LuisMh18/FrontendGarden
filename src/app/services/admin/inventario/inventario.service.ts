import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../../global';

@Injectable()
export class InventarioService {
  public url: string;

  constructor(
    private _http: Http,
  ) {
    this.url = GLOBAL.url;
  }


  getData(token, page = null, dataform) {
    let params = JSON.stringify(dataform);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let ruta_page = (page == null) ? 'admin/inventario?token=' + token : 'admin/inventario?token=' + token + '&page=' + page;
    return this._http.post(this.url + ruta_page, params, options)
      .map(res => res.json());

  }

}
