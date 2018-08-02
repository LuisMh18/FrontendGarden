import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.css']
})
export class AgentesComponent implements OnInit {

  public titulo: string;
  public user;
  public identity;
  public token;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.titulo = 'Agentes';
  }

  ngOnInit() {
    console.log('Componente de agentes cargado');
    this.identity = JSON.parse(localStorage.getItem('identity'));
    if (this.identity.rol_id === 3) {
      this._router.navigate(['admin']);
    } else if (this.identity.rol_id === 1) {
      this._router.navigate(['clientes']);
    }
  }

}
