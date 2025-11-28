import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  isLoggedIn: boolean = false; // ← Cambia a inicialización directa
  tokenChanged: EventEmitter<string>;

  constructor() {
    this.tokenChanged = new EventEmitter();
    this.isLoggedIn = localStorage.getItem('auth_token') !== null; // ← Como el proyecto de ejemplo
  }

  public setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.isLoggedIn = true;
    this.tokenChanged.emit(token); // ← Emite el token, no undefined
  }

  public resetToken(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedIn = false;
    this.tokenChanged.emit(undefined);
  }

  public getToken(): string {
    return localStorage.getItem('auth_token')?.toString() || 'null';
  }
}
