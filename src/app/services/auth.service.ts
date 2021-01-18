// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//  RxJS
import { Observable } from 'rxjs';
// Enviroment
import { environment } from 'src/environments/environment';

// const AUTH_API = 'http://localhost:8080/api/auth/';
const AUTH_API = `${environment.API_URL}/auth/`;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credenciales): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username: credenciales.usuario,
        password: credenciales.password,
      },
      httpOptions
    );
  }

  register(user): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        usuario: user.username,
        email: user.email,
        password: user.password,
      },
      httpOptions
    );
  }
}
