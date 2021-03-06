import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AlmacenComponent } from './components/admin/almacen/almacen.component';
import { CategoriasComponent } from './components/admin/categorias/categorias.component';
import { ClienteComponent } from './components/admin/cliente/cliente.component'; //para el admin
import { UsuariosComponent } from './components/admin/usuarios/usuarios.component';
import { ComercializadorComponent } from './components/admin/comercializador/comercializador.component';
import { InventarioComponent } from './components/admin/inventario/inventario.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { DetallePedidoComponent } from './components/agentes/detalle-pedido/detalle-pedido.component';
import { ClientesComponent } from './components/front/clientes/clientes.component';//para el front


const routes: Routes = [
    { path: '', component: LoginComponent },//cuando el path este vacio que nos cargue el login
    { path: 'login', component: LoginComponent },//cuando el path sea login que nos cargue el login
    { path: 'admin', component: DashboardComponent },
    { path: 'almacen', component: AlmacenComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'cliente', component: ClienteComponent },//para el admin
    { path: 'comercializador', component: ComercializadorComponent },
    { path: 'inventario', component: InventarioComponent },
    { path: 'agentes', component: AgentesComponent },
    { path: 'agentes/:id_pedido/:id_cliente', component: DetallePedidoComponent}, 
    { path: 'clientes', component: ClientesComponent },//para el front
    { path: '**', component: LoginComponent }//cuando la ruta no exista nos muestra el login
];


export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes); //cargamos las rutas