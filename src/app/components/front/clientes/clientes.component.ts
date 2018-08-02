import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public titulo: string;
  public user;
  public identity;
  public token;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.titulo = 'Clientes';
  }

  ngOnInit() {
    console.log('Componente de clientes cargado');
    this.identity = JSON.parse(localStorage.getItem('identity'));
    console.log(this.identity);
    if (this.identity.rol_id === 2) {
      this._router.navigate(['agentes']);
    } else if(this.identity.rol_id === 3) {
      this._router.navigate(['admin']);
    }
  }

}
