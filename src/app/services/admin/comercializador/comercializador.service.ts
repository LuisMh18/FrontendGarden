import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../../global';

@Injectable()
export class ComercializadorService {
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
    let ruta_page = (page == null) ? 'admin/comercializador/index?token=' + token : 'admin/comercializador/index?token=' + token + '&page=' + page;
    return this._http.post(this.url + ruta_page, params, options)
      .map(res => res.json());

  }

  getAll(token) {
    return this._http.get(this.url+'admin/comercializador/data?token='+token)
                     .map(res => res.json());
 }  

  delete(token, id){
    return this._http.delete(this.url+'admin/comercializador/'+id+'?token='+token)
                       .map(res => res.json());
  }

  add(token, data):Observable<any>{
    let params = JSON.stringify(data);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

      return this._http.post(this.url+'admin/comercializador?token='+token, params, options)
                       .map(res => res.json());
  }


  edit(token, id) {
      return this._http.get(this.url+'admin/comercializador/'+id+'?token='+token)
                       .map(res => res.json());

  }

  update(token, data): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

      return this._http.put(this.url+'admin/comercializador/'+data.id+'?token='+token, params, options)
                       .map(res => res.json());

  }




}
