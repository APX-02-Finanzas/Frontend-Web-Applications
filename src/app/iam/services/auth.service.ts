import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { User } from '../model/user.entity';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

const usersResourceEndpoint = environment.usersEndpointPath;
const authenticationResourceEndpoint = environment.authenticationEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<User> {

  private readonly authenticationPath: string;

  constructor() {
    super();
    this.resourceEndpoint = usersResourceEndpoint;
    this.authenticationPath = authenticationResourceEndpoint;
  }

  private getHttpOptionsWithoutAuth() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(
      `${this.serverBaseUrl}${this.authenticationPath}/sign-in`,
      {
        "username": username,
        "password": password
      },
      this.getHttpOptionsWithoutAuth()
    ).pipe(
      tap((user: User) => {
        if (user && user.token) {
          this.tokenService.setToken(user.token);

          try {
            localStorage.setItem('user_name', user.name || '');
            localStorage.setItem('user_surname', user.surname || '');
            localStorage.setItem('username', user.username || '');
            if (user.id !== undefined && user.id !== null) {
              localStorage.setItem('user_id', user.id.toString());
            }
            localStorage.setItem('user_data', JSON.stringify(user));
          } catch (e) {
            console.warn('No se pudo guardar user en localStorage:', e);
          }
        }
      })
    );
  }

  signup(username: string, password: string, name: string, surname: string, email: string, role: string = 'ROLE_SALESMAN'): Observable<any> {
    const signupData = {
      username: username,
      password: password,
      name: name,
      surname: surname,
      email: email,
      roles: [role]
    };

    console.log('Enviando datos de registro:', signupData);

    return this.http.post<any>(
      `${this.serverBaseUrl}${this.authenticationPath}/sign-up`,
      signupData,
      this.getHttpOptionsWithoutAuth()
    );
  }

  fetchLoggedUser(): Observable<User> {
    return this.http.get<User>(`${this.resourcePath()}/me`, this.httpOptions);
  }

  getCurrentSalesManId(): number {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.id) return user.id;
      } catch (e) {
        console.error('Error parsing user_data:', e);
      }
    }

    const userId = localStorage.getItem('user_id');
    if (userId) {
      const parsed = parseInt(userId, 10);
      if (!isNaN(parsed)) return parsed;
    }

    return 1;
  }
}
