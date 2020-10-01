import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';

export abstract class CommonService<E, ID> {
  protected API_URL: string;

  constructor(protected http: HttpClient) {}

  getAll(): Observable<E[]> {
    return this.http.get<E[]>(this.API_URL + 'all');
  }

  save(entity: E): Observable<E> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<E>(this.API_URL + 'save', JSON.stringify(entity), {
      headers: headers,
    });
  }

  delete(id: ID): Observable<E> {
    return this.http.get<E>(this.API_URL + 'delete/' + id);
  }
}
