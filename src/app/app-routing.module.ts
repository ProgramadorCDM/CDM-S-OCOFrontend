// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Provider
import { LoginGuard } from './services/login-guard.service';
// Components
import { ResumeComponent } from './components/dashboard/resume/resume.component';
import { LoginComponent } from './components/login/login.component';
import { ProductosComponent } from './components/dashboard/productos/productos.component';
import { ProveedoresComponent } from './components/dashboard/proveedores/proveedores.component';
import { RequisicionesComponent } from './components/dashboard/requisiciones/requisiciones.component';
import { ComprasComponent } from './components/dashboard/compras/compras.component';
import { PedidosComponent } from './components/dashboard/requisiciones/pedidos/pedidos.component';

const routes: Routes = [
  {path: 'resume', component: ResumeComponent, canActivate: [LoginGuard]},
  {path: 'productos', component: ProductosComponent, canActivate: [LoginGuard]},
  {path: 'proveedores', component: ProveedoresComponent, canActivate: [LoginGuard]},
  {path: 'requisiciones', component: RequisicionesComponent, canActivate: [LoginGuard]},
  {path: 'requisiciones/pedidos/:id', component: PedidosComponent, canActivate: [LoginGuard]},
  {path: 'compras', component: ComprasComponent, canActivate: [LoginGuard]},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'resume', canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
