import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertiesService } from '../../services/properties.service';
import { Property } from '../../model/property.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-properties-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-properties-page.html',
  styleUrl: './edit-properties-page.css',
})
export class EditPropertiesPage implements OnInit {

  form: FormGroup;
  loading = true;
  error = '';
  submitting = false;
  private propertyId = 0;

  currencies = ['PEN', 'USD', 'EUR'];
  roomsOptions = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private propertiesService: PropertiesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['PEN', Validators.required],
      m2: [0, [Validators.required, Validators.min(0)]],
      rooms: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.error = 'Id no proporcionado';
      this.loading = false;
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error = 'Id inválido';
      this.loading = false;
      return;
    }

    this.propertyId = id;

    this.propertiesService.getById(id).subscribe({
      next: (property: Property) => {
        this.form.patchValue({
          title: property.title ?? '',
          address: property.address ?? '',
          price: property.price ?? 0,
          currency: property.currency ?? 'PEN',
          m2: property.m2 ?? 0,
          rooms: property.rooms ?? 1
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando propiedad:', err);
        this.error = 'Error al cargar el inmobiliario';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const payload = {
      title: this.form.value.title,
      address: this.form.value.address,
      price: this.form.value.price,
      currency: this.form.value.currency,
      m2: this.form.value.m2,
      rooms: this.form.value.rooms,
      description: ''
    };

    this.propertiesService.update(this.propertyId, payload as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/properties']);
      },
      error: (err) => {
        console.error('Error actualizando inmobiliario:', err);
        this.submitting = false;
        alert('Error al editar el inmobiliario. Revisa la consola.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/properties']);
  }
}
