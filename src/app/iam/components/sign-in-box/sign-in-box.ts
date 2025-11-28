import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../../shared/services/token.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-sign-in-box',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in-box.html',
  styleUrls: ['./sign-in-box.css'],
})
export class SignInBox implements OnDestroy {
  @Output() switchTo = new EventEmitter<'sign-up' | 'sign-in'>();
  form: FormGroup;
  submitting = false;
  passwordVisible = false;
  private authSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  get usernameCtrl() { return this.form.get('username'); }
  get passwordCtrl() { return this.form.get('password'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { username, password } = this.form.value;

    this.authSub?.unsubscribe();

    this.authSub = this.authService.login(username.trim(), password).subscribe({
      next: (user) => {
        if (user.token) {
          this.tokenService.setToken(user.token);

          this.authService.fetchLoggedUser().subscribe({
            next: (fullUserData) => {
              this.submitting = false;

              try {
                localStorage.setItem('user_data', JSON.stringify(fullUserData));
              } catch (e) {
                console.error('Error saving user data:', e);
              }

              this.router.navigate(['/clients']);
            },
            error: (err) => {
              this.submitting = false;
              try {
                localStorage.setItem('user_data', JSON.stringify(user));
              } catch (e) {
                console.error('Error saving basic user data:', e);
              }
              this.router.navigate(['/clients']);
            }
          });
        } else {
          this.submitting = false;
          alert('Error: No se recibió token de autenticación');
        }
      },
      error: err => {
        this.submitting = false;
        const msg = err?.error?.message || 'Error en el inicio de sesión';

        if (err.status === 401) {
          alert('Error: Credenciales inválidas');
        } else if (err.status === 0) {
          alert('Error: No se puede conectar al servidor');
        } else {
          alert('Error: ' + msg);
        }
      }
    });
  }

  onSwitchToSignUp(event: Event): void {
    event.preventDefault();
    this.switchTo.emit('sign-up');
  }
}
