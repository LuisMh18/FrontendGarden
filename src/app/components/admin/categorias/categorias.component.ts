import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  public titulo;
  constructor() { 
    this.titulo = 'Categorías';
  }

  ngOnInit() {
  }

}
