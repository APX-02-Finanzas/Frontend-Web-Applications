import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  isLoggedIn: boolean;
  tokenChanged: EventEmitter<string>;

  constructor() {
    this.tokenChanged = new EventEmitter();
    this.isLoggedIn = this.checkTokenValidity();
  }

  public setToken(token: string): void {
    if (token && token !== 'null' && token !== 'undefined') {
      localStorage.setItem('auth_token', token);
      this.isLoggedIn = true;
      this.tokenChanged.emit(token);
    } else {
    }
  }

  public resetToken(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedIn = false;
    this.tokenChanged.emit('');
  }

  public getToken(): string {
    const token = localStorage.getItem('auth_token') || '';
    return token;
  }

  private checkTokenValidity(): boolean {
    const token = this.getToken();
    const isValid = !!(token && token !== 'null' && token !== 'undefined' && token !== '');
    return isValid;
  }
}
