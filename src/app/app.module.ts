import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//notificaciones
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//rutas
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { ClientesComponent } from './components/front/clientes/clientes.component';
import { AlmacenComponent } from './components/admin/almacen/almacen.component';
import { CategoriasComponent } from './components/admin/categorias/categorias.component';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

import {DialogModule} from 'primeng/dialog';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { ComercializadorComponent } from './components/admin/comercializador/comercializador.component';
import { ClienteComponent } from './components/admin/cliente/cliente.component';

import {DataViewModule} from 'primeng/dataview';

import { DropdownModule, PanelModule } from 'primeng/primeng';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AgentesComponent,
    ClientesComponent,
    AlmacenComponent,
    ComercializadorComponent,
    ClienteComponent,
    CategoriasComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    UiSwitchModule,
    DataViewModule,
    DropdownModule,
    PanelModule,
  ],
  providers: [
    appRoutingProviders,
    ConfirmationService,
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
