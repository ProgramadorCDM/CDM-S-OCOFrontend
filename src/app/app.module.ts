// Angular
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { PrimeNGModule } from './primeng.module';
// Providers
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
// Pipes
import { FilesizePipe } from './pipes/filesize.pipe';
// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResumeComponent } from './components/dashboard/resume/resume.component';
import { ProductosComponent } from './components/dashboard/productos/productos.component';
import { ProveedoresComponent } from './components/dashboard/proveedores/proveedores.component';
import { RequisicionesComponent } from './components/dashboard/requisiciones/requisiciones.component';
import { ComprasComponent } from './components/dashboard/compras/compras.component';
import { ClientesComponent } from './components/dashboard/clientes/clientes.component';
import { ProductosbyproveedorComponent } from './components/dashboard/proveedores/productosbyproveedor/productosbyproveedor.component';
import { PedidosComponent } from './components/dashboard/requisiciones/pedidos/pedidos.component';
import { VerComprasComponent } from './components/dashboard/compras/ver-compras/ver-compras.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    DashboardComponent,
    FilesizePipe,
    ResumeComponent,
    ProductosComponent,
    ProveedoresComponent,
    RequisicionesComponent,
    ComprasComponent,
    ClientesComponent,
    ProductosbyproveedorComponent,
    PedidosComponent,
    VerComprasComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
  ],
  providers: [
    authInterceptorProviders,
    MessageService,
    DialogService,
    ConfirmationService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
