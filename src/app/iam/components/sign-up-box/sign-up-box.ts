import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-up-box',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up-box.html',
  styleUrls: ['./sign-up-box.css'],
})
export class SignUpBox {
  @Output() switchTo = new EventEmitter<'sign-up' | 'sign-in'>();
  form: FormGroup;
  submitting = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  get nameCtrl() { return this.form.get('name'); }
  get surnameCtrl() { return this.form.get('surname'); }
  get emailCtrl() { return this.form.get('email'); }
  get usernameCtrl() { return this.form.get('username'); }
  get passwordCtrl() { return this.form.get('password'); }
  get confirmPasswordCtrl() { return this.form.get('confirmPassword'); }

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
  };

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const username = (this.usernameCtrl?.value ?? '').toString();
    const password = (this.passwordCtrl?.value ?? '').toString();
    const name = (this.nameCtrl?.value ?? '').toString();
    const surname = (this.surnameCtrl?.value ?? '').toString();
    const email = (this.emailCtrl?.value ?? '').toString();

    this.authService.signup(username, password, name, surname, email, 'ROLE_SALESMAN')
      .subscribe({
        next: (response) => {
          this.submitting = false;
          console.log('Respuesta del servidor:', response);
          alert(`Cuenta creada correctamente para: ${response.username}`);
          this.form.reset();
          this.switchTo.emit('sign-in');
        },
        error: err => {
          this.submitting = false;
          console.error('Error completo:', err);
          let errorMessage = 'Error en el registro';
          if (err.status === 401) {
            errorMessage = 'Error de autenticación - revisa los datos';
          } else if (err.status === 400) {
            errorMessage = 'Datos inválidos - ' + (err.error?.message || 'verifica la información');
          } else if (err.status === 409) {
            errorMessage = 'El usuario ya existe';
          }
          alert('Error: ' + errorMessage);
        }
      });
  }

  onSwitchToSignIn(event: Event) {
    event.preventDefault();
    this.switchTo.emit('sign-in');
  }
}
