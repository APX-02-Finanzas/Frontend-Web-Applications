import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export abstract class BaseService<T> {
  protected httpOptions = { headers: new HttpHeaders() };
  protected fileHttpOptions = { headers: new HttpHeaders() };
  protected serverBaseUrl: string = `${environment.serverBaseUrl}`;
  protected resourceEndpoint: string = '/resources';
  protected http: HttpClient = inject(HttpClient);
  protected tokenService: TokenService = inject(TokenService);

  protected constructor() {
    this.setBaseToken(this.tokenService.getToken());
    this.tokenService.tokenChanged.subscribe((token) => {
      this.setBaseToken(token);
    });
  }

  private setBaseToken(token: string): void {
    const headers: { [name: string]: string } = {
      'Content-Type': 'application/json'
    };

    if (token && token !== 'null' && token !== 'undefined' && token !== '') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    this.httpOptions = {
      headers: new HttpHeaders(headers)
    };
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error del cliente:', error.error.message);
    } else {
      console.error(`Error del servidor (${error.status}):`, error.error);
    }

    const message = error.status === 0
      ? 'No se puede conectar al servidor'
      : (error.error?.message || 'Error en la operación');

    return throwError(() => new Error(message));
  }

  protected resourcePath(): string {
    return `${this.serverBaseUrl}${this.resourceEndpoint}`;
  }

  public create(resource: T): Observable<T> {
    return this.http.post<T>(this.resourcePath(), JSON.stringify(resource), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getAll(): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getById(id: any): Observable<T> {
    return this.http.get<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public update(id: any, resource: T): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, JSON.stringify(resource), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public delete(id: any): Observable<T> {
    return this.http.delete<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
