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
    } else if (url.startsWith('/plans')) {
      this.active = 'creditos';
    } else {
      this.active = 'clientes';
    }
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('user_data');

    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.setUserData(user);
        return;
      } catch (e) {
        console.error('Error parsing user_data:', e);
      }
    }
    this.loadUserFromApi();
  }

  private setUserData(user: any): void {
    const userName = user.name || '';
    const userSurname = user.surname || '';

    this.fullName = `${userName} ${userSurname}`.trim();

    if (!this.fullName) {
      this.fullName = user.username || 'Usuario';
    }
  }

  private loadUserFromApi(): void {
    this.authService.fetchLoggedUser().subscribe({
      next: (user: any) => {
        if (user) {
          this.setUserData(user);
          try {
            localStorage.setItem('user_data', JSON.stringify(user));
          } catch (e) {
            console.error('Error saving user data:', e);
          }
        }
      },
      error: () => {
        this.fullName = 'Usuario';
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
      this.router.navigate(['/plans']);
    }
  }

  logout(event?: Event) {
    event?.preventDefault();

    this.tokenService.resetToken();
    this.authService.clearUserData();

    this.router.navigate(['/auth']);
  }
  openClaimsForm(event?: Event) {
    event?.preventDefault();
    this.router.navigate(['/claims']); // o la ruta que prefieras
  }

}
