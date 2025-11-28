import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  isLoggedIn: boolean = false;
  tokenChanged: EventEmitter<string>;

  constructor() {
    this.tokenChanged = new EventEmitter();
    this.isLoggedIn = localStorage.getItem('auth_token') !== null;
  }

  public setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.isLoggedIn = true;
    this.tokenChanged.emit(token);
  }

  public resetToken(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedIn = false;
    this.tokenChanged.emit(undefined);
  }

  public getToken(): string {
    const token = localStorage.getItem('auth_token');
    return token ? token : '';
  }
}
