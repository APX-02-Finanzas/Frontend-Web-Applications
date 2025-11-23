import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { AuthService } from '../../../iam/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-create-clients-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-clients-page.html',
  styleUrls: ['./create-clients-page.css'],
})
export class CreateClientsPage {
  form: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dni: ['', Validators.required],
      monthlyIncome: [0, [Validators.required, Validators.min(0)]],
      monthlyExpenses: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const salesManId = this.authService.getCurrentSalesManId();

    const payload = {
      name: (this.form.get('name')?.value ?? '').toString(),
      email: (this.form.get('email')?.value ?? '').toString(),
      phone: (this.form.get('phone')?.value ?? '').toString(),
      dni: (this.form.get('dni')?.value ?? '').toString(),
      salesManId: salesManId,
      monthlyIncome: Number(this.form.get('monthlyIncome')?.value) || 0,
      monthlyExpenses: Number(this.form.get('monthlyExpenses')?.value) || 0,
    };

    this.clientsService.create(payload as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error creating client:', err);
        alert('Error al crear el cliente. Revisa la consola.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}
