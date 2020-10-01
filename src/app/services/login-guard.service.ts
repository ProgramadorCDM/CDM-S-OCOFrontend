import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private tokenStorage: TokenStorageService, private router: Router) { }

  canActivate(){
    if (!this.tokenStorage.getToken()) {
      console.warn('No estas Logueado');
      this.router.navigate(['/login']);
      return false
    } else {
      return true
    }
  }

}
