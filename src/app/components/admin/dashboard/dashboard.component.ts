import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public titulo: string;
  public user;
  public identity;
  public token;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.titulo = 'Dashboard';
  }

  ngOnInit() {
    console.log('Componente del dashboard cargado');
    this.identity = JSON.parse(localStorage.getItem('identity'));
    /*if (this.identity.rol_id !== 3){
      window.history.back();
    }*/
    if (this.identity.rol_id === 2) {
      this._router.navigate(['agentes']);
    } else if (this.identity.rol_id === 1) {
      this._router.navigate(['clientes']);
    }
  }

}
