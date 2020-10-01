import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get('assets/config/app-config.json');
  }
}
