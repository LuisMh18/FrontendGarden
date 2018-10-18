import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../../global';

@Injectable()
export class UsuariosService {
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
    let ruta_page = (page == null) ? 'admin/usuarios/index?token=' + token : 'admin/usuarios/index?token=' + token + '&page=' + page;
    return this._http.post(this.url + ruta_page, params, options)
      .map(res => res.json());
  }

  getAll(token) {
    return this._http.get(this.url+'admin/usuarios/data?token='+token)
                     .map(res => res.json());
 } 

 getRol(token) {
  return this._http.get(this.url+'admin/usuarios/rol?token='+token)
                   .map(res => res.json());
} 


edit(token, id) {
  return this._http.get(this.url+'admin/usuarios/'+id+'?token='+token)
                   .map(res => res.json());

}

}
