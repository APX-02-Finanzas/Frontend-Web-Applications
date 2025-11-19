import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../iam/services/auth.service';
import { TokenService } from '../../../shared/services/token.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar implements OnInit, OnDestroy {
  fullName = 'Cargando...';
  avatarUrl = '/assets/profile_placeholder.png';
  active: 'clientes' | 'inmobiliario' | 'creditos' | null = null;
  private routerSub?: Subscription;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.updateActiveFromUrl(this.router.url);
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveFromUrl(event.urlAfterRedirects || event.url);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private updateActiveFromUrl(url: string) {
    if (!url) return;
    if (url.startsWith('/clients')) {
      this.active = 'clientes';
    } else if (url.startsWith('/properties')) {
      this.active = 'inmobiliario';
    } else if (url.startsWith('/creditos')) {
      this.active = 'creditos';
    } else {
      this.active = 'clientes';
    }
  }

  private loadUserData(): void {
    const name = localStorage.getItem('user_name');
    const surname = localStorage.getItem('user_surname');
    const username = localStorage.getItem('username');
    const localAvatar = localStorage.getItem('user_avatar');

    if (localAvatar) {
      this.avatarUrl = localAvatar;
    }

    if (name && surname) {
      this.fullName = `${name} ${surname}`.trim();
      return;
    } else if (username) {
      this.fullName = username;
      return;
    }

    this.authService.fetchLoggedUser().subscribe({
      next: (user: any) => {
        if (user) {
          const userName = user.name || user.firstName || user.username || '';
          const userSurname = user.surname || user.lastName || '';
          const avatarFromApi = user.avatar || user.photoUrl || user.profileImage || '';

          this.fullName = `${userName} ${userSurname}`.trim() || user.username || 'Usuario';

          if (userName) localStorage.setItem('user_name', userName);
          if (userSurname) localStorage.setItem('user_surname', userSurname);
          if (user.username) localStorage.setItem('username', user.username);
          if (user.id !== undefined && user.id !== null) localStorage.setItem('user_id', user.id.toString());
          if (avatarFromApi) {
            this.avatarUrl = avatarFromApi;
            try { localStorage.setItem('user_avatar', avatarFromApi); } catch (e) {}
          }
          try { localStorage.setItem('user_data', JSON.stringify(user)); } catch (e) {}
        }
      },
      error: () => {
        const username = localStorage.getItem('username');
        this.fullName = username || 'Usuario';
      }
    });
  }

  select(item: 'clientes' | 'inmobiliario' | 'creditos', event?: Event) {
    event?.preventDefault();
    this.active = item;

    if (item === 'clientes') {
      this.router.navigate(['/clients']);
    } else if (item === 'inmobiliario') {
      this.router.navigate(['/properties']);
    } else if (item === 'creditos') {
      this.router.navigate(['/creditos']);
    }
  }

  logout(event?: Event) {
    event?.preventDefault();

    this.tokenService.resetToken();

    localStorage.removeItem('user_name');
    localStorage.removeItem('user_surname');
    localStorage.removeItem('user_avatar');
    localStorage.removeItem('username');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_data');

    this.router.navigate(['/auth']).then(() => {
      console.log('Sesión cerrada correctamente');
    }).catch(error => {
      console.error('Error al navegar:', error);
    });
  }
}
