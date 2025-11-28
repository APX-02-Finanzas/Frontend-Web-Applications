import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { User } from '../model/user.entity';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

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

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(
      `${this.serverBaseUrl}${this.authenticationPath}/sign-in`,
      { username, password },
      this.httpOptions
    );
  }

  signup(username: string, password: string, name: string, surname: string, email: string, role: string = 'ROLE_SALESMAN', recaptchaToken: string): Observable<any> {
    const body = {
      username: username.trim(),
      password,
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      roles: [role],
      recaptchaToken,
    };

    return this.http.post<any>(
      `${this.serverBaseUrl}${this.authenticationPath}/sign-up`,
      body,
      this.httpOptions
    );
  }

  fetchLoggedUser(): Observable<User> {
    return this.http.get<User>(`${this.resourcePath()}/me`, this.httpOptions);
  }

  getCurrentSalesManId(): number {
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) throw new Error('No user data found');

      const user = JSON.parse(userData);
      if (!user?.id) throw new Error('User ID not found');

      return user.id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      throw new Error('No se pudo obtener el ID del usuario actual. Por favor, inicie sesión nuevamente.');
    }
  }

  clearUserData(): void {
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
  }
}
