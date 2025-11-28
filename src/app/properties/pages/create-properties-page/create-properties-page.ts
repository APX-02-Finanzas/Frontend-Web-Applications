import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertiesService } from '../../services/properties.service';
import { AuthService } from '../../../iam/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-properties-page',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-properties-page.html',
  styleUrl: './create-properties-page.css',
  standalone: true
})
export class CreatePropertiesPage {
  form: FormGroup;
  submitting = false;

  currencies = ['PEN', 'USD', 'EUR'];
  roomsOptions = [1, 2, 3, 4, 5];


  constructor(
    private fb: FormBuilder,
    private propertiesService: PropertiesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['PEN', Validators.required],
      m2: [0, [Validators.required, Validators.min(0)]],
      rooms: [1, [Validators.required, Validators.min(1)]]
    });
  }

  exchangeRates: Record<string, number> = {
    USD: 3.5,
    EUR: 4.0,
    PEN: 1
  };

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    this.submitting = true;

    const salesManId = this.authService.getCurrentSalesManId();

    if (!salesManId) {
      alert('No se pudo identificar al vendedor actual.');
      this.submitting = false;
      return;
    }

    const currencyRaw = this.form.get('currency')?.value;
    const currency = (currencyRaw || 'PEN').toUpperCase();

    const originalPrice = Number(this.form.get('price')?.value) || 0;

    const rate = this.exchangeRates[currency] ?? 1;
    const priceInPen = originalPrice * rate;

    const payload = {
      title: this.form.get('title')?.value,
      description: '',
      address: this.form.get('address')?.value,

      price: priceInPen,
      currency: 'PEN',

      originalCurrency: currency,
      originalPrice: originalPrice,

      salesManId,
      m2: this.form.get('m2')?.value,
      rooms: this.form.get('rooms')?.value,
    };

    this.propertiesService.create(payload as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/properties']);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error creating property:', err);
        alert('Error al crear el inmobiliario. Revisa la consola.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/properties']);
  }
}
