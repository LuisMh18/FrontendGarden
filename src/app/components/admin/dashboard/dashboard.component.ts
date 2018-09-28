import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {SelectItem} from 'primeng/api';

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
  es: any;//calendar
  pedidos: SelectItem[];
  selectedP: string;
  data: any;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
    ) {
      this.titulo = 'Dashboard';

      /*this.pedidos = [
        {label: 'New York', value: 'NY'},
        {label: 'Rome', value: 'RM'},
        {label: 'London', value: 'LDN'},
        {label: 'Istanbul', value: 'IST'},
        {label: 'Paris', value: 'PRS'}
      ];*/

      this.pedidos = [
        {label:'Pedidos del día', value:1},
        {label:'Pedidos del mes', value:{id:1, name: 'New York', code: 'NY'}},
        {label:'Pedidos por año', value:{id:2, name: 'Rome', code: 'RM'}},
        {label:'Pedidos por periodo', value:{id:3, name: 'London', code: 'LDN'}}
      ];

      this.data = {
        datasets: [{
            data: [
                1,
                19,
                17,
                21,
                18,
            ],
            backgroundColor: [
                "#36A2EB",
                "#4BC0C0",
                "#E433FF",
                "#FFCE56",
                "#E7E9ED"
            ],
            label: 'Pedidos'
        }],
        labels: [
          "Del día",
          "Pagados",
          "Crédito",
          "Pendientes",
          "Cancelados"

        ]
    }

    



    }
    
    ngOnInit() {
      
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      dayNamesShort: ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],
      dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
      monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthNamesShort: [ "Ene","Feb","Mar","Abr","Mayo","Jun","Jul","Ago","Sep","Oct","Nov","Dic" ],
      today: 'Hoy',
      clear: 'Limpiar'
  };

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
