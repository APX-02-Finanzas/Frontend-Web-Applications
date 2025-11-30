import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-claims-form-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './claims-form-page.html',
  styleUrls: ['./claims-form-page.css'],
})
export class ClaimsFormPage {
  form: FormGroup;
  submitting = false;

  types = ['Reclamo', 'Queja'];
  productTypes = ['Producto', 'Servicio'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      documentType: ['DNI', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: [''],
      claimType: ['Reclamo', Validators.required],
      productType: ['Servicio', Validators.required],
      amount: [null, [Validators.min(0)]],
      incidentDate: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      request: ['', [Validators.required, Validators.minLength(10)]],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    console.log('Libro de reclamaciones enviado:', this.form.value);

    setTimeout(() => {
      this.submitting = false;
      alert('Tu reclamo ha sido registrado correctamente.');
      this.form.reset({
        documentType: 'DNI',
        claimType: 'Reclamo',
        productType: 'Servicio',
        acceptTerms: false,
      });
    }, 500);
  }
}
