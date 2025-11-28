import { Component, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CaptchaService } from '../../services/captcha.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-sign-up-box',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up-box.html',
  styleUrls: ['./sign-up-box.css'],
})
export class SignUpBox implements OnInit, OnDestroy, AfterViewInit {
  @Output() switchTo = new EventEmitter<'sign-up' | 'sign-in'>();
  form: FormGroup;
  submitting = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  recaptchaToken: string = '';
  captchaError = false;
  captchaLoaded = false;
  captchaLoading = false;
  private captchaSub?: Subscription;
  private isComponentActive = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private captchaService: CaptchaService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.captchaSub = this.captchaService.tokenChange.subscribe(token => {
      this.recaptchaToken = token;
      if (token) {
        this.captchaError = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadCaptcha();
    }, 100);
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
    this.captchaSub?.unsubscribe();
  }

  private loadCaptcha(): void {
    if (this.captchaLoading || this.captchaLoaded) {
      return;
    }

    this.captchaLoading = true;
    this.captchaError = false;
    this.captchaLoaded = false;

    this.captchaService.getSiteKey().subscribe({
      next: cfg => {
        if (!cfg?.siteKey) {
          throw new Error('No se obtuvo siteKey');
        }

        this.captchaService.loadScriptV2()
          .then(() => this.captchaService.render('recaptcha-container', cfg.siteKey))
          .then(() => {
            this.captchaLoaded = true;
            this.captchaLoading = false;
          })
          .catch(() => {
            this.captchaError = true;
            this.captchaLoading = false;
            this.captchaLoaded = false;
          });
      },
      error: () => {
        this.captchaError = true;
        this.captchaLoading = false;
        this.captchaLoaded = false;
      }
    });
  }

  reloadCaptcha(): void {
    this.captchaService.reload().then(() => {
      this.captchaLoaded = false;
      this.captchaError = false;
      this.recaptchaToken = '';
      this.loadCaptcha();
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
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
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.recaptchaToken) {
      if (!this.recaptchaToken) {
        this.captchaError = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    this.submitting = true;
    this.captchaError = false;

    const { username, password, name, surname, email } = this.form.value;

    this.authService.signup(
      username.trim(),
      password,
      name.trim(),
      surname.trim(),
      email.trim(),
      'ROLE_SALESMAN',
      this.recaptchaToken
    ).subscribe({
        next: (response) => {
          this.submitting = false;
          const successUsername = response?.username || username;
          alert(`Cuenta creada correctamente para: ${successUsername}`);
          this.form.reset();
          if (this.isComponentActive) {
            this.captchaService.reset();
          }
          this.switchTo.emit('sign-in');
        },
        error: err => {
          this.submitting = false;

          if (err.status === 401) {
            this.captchaError = true;
            this.reloadCaptcha();
          } else if (err.status === 400) {
            const errorMessage = 'Datos inválidos - ' + (err.error?.message || 'verifica la información');
            alert('Error: ' + errorMessage);
          } else if (err.status === 409) {
            alert('Error: El usuario ya existe');
          } else if (err.status === 0) {
            alert('Error: No se puede conectar al servidor');
          } else {
            alert('Error: Error en el registro');
          }

          if (this.isComponentActive) {
            this.captchaService.reset();
            this.recaptchaToken = '';
          }
        }
      });
  }

  onSwitchToSignIn(event: Event): void {
    event.preventDefault();
    this.switchTo.emit('sign-in');
  }
}
