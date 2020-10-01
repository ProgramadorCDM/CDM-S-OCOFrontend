// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Provider
import { LoginGuard } from './services/login-guard.service';
// Components
import { ResumeComponent } from './components/dashboard/resume/resume.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path: 'resume', component: ResumeComponent, canActivate: [LoginGuard]},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'resume', canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
