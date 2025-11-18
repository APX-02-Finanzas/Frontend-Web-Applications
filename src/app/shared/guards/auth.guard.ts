import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');
    const hasValidToken = token && token !== 'null' && token !== 'undefined' && token.length > 10;

    if (hasValidToken) {
      return true;
    }

    this.router.navigate(['/no-access']);
    return false;
  }
}
