import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AgentesComponent,
    ClientesComponent,
    AlmacenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    ConfirmDialogModule,
  ],
  providers: [
    appRoutingProviders,
    ConfirmationService
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
