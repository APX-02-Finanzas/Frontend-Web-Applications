import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-in-box',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in-box.html',
  styleUrls: ['./sign-in-box.css'],
})
export class SignInBox {
  @Output() switchTo = new EventEmitter<'sign-up' | 'sign-in'>();
  form: FormGroup;
  submitting = false;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  get usernameCtrl() {
    return this.form.get('username');
  }

  get passwordCtrl() {
    return this.form.get('password');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const username = (this.usernameCtrl?.value ?? '').toString();
    const password = (this.passwordCtrl?.value ?? '').toString();

    this.authService.login(username, password).subscribe({
      next: (user) => {
        this.submitting = false;
        this.router.navigate(['/clients']);
      },
      error: err => {
        this.submitting = false;
        console.error('Login error:', err);
        const msg = err?.error?.message || 'Error en el inicio de sesión';
        alert('Error: ' + msg);
      }
    });
  }

  onSwitchToSignUp(event: Event) {
    event.preventDefault();
    this.switchTo.emit('sign-up');
  }
}
