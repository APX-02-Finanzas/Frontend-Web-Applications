import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { CivilState } from '../../model/client.entity';

@Component({
  standalone: true,
  selector: 'app-edit-clients-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-clients-page.html',
  styleUrls: ['./edit-clients-page.css'],
})
export class EditClientsPage implements OnInit {
  form: FormGroup;
  loading = true;
  error = '';
  submitting = false;
  private clientId = 0;

  civilStateOptions: { value: string; label: string }[] = [
    { value: 'SINGLE', label: CivilState.SINGLE },
    { value: 'MARRIED', label: CivilState.MARRIED },
    { value: 'DIVORCED', label: CivilState.DIVORCED },
    { value: 'WIDOWED', label: CivilState.WIDOWED }
  ];

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dni: ['', Validators.required],
      civilState: ['SINGLE', Validators.required],
      monthlyIncome: [0, [Validators.required, Validators.min(0)]],
      monthlyExpenses: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'Id no proporcionado';
      this.loading = false;
      return;
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      this.error = 'Id inválido';
      this.loading = false;
      return;
    }

    this.clientId = id;
    this.clientsService.getById(id).subscribe({
      next: client => {
        this.form.patchValue({
          name: client.name ?? '',
          surname: client.surname ?? '',
          email: client.email ?? '',
          phone: client.phone ?? '',
          dni: client.dni ?? '',
          civilState: this.civilStateKeyFrom(client.civilState),
          monthlyIncome: client.monthlyIncome ?? 0,
          monthlyExpenses: client.monthlyExpenses ?? 0,
        });
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando cliente:', err);
        this.error = 'Error al cargar el cliente';
        this.loading = false;
      }
    });
  }

  private civilStateKeyFrom(value: any): string {
    if (!value) return 'SINGLE';
    const upper = (value as string).toUpperCase?.() ?? '';
    const keys = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'];
    if (keys.includes(upper)) return upper;
    for (const key of keys) {
      if ((CivilState as any)[key] === value) return key;
    }
    return 'SINGLE';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const payload = {
      name: (this.form.get('name')?.value ?? '').toString(),
      surname: (this.form.get('surname')?.value ?? '').toString(),
      email: (this.form.get('email')?.value ?? '').toString(),
      phone: (this.form.get('phone')?.value ?? '').toString(),
      dni: (this.form.get('dni')?.value ?? '').toString(),
      civilState: this.form.get('civilState')?.value, // valor en inglés (SINGLE, MARRIED...)
      monthlyIncome: Number(this.form.get('monthlyIncome')?.value) || 0,
      monthlyExpenses: Number(this.form.get('monthlyExpenses')?.value) || 0,
    };

    this.clientsService.update(this.clientId, payload as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/clients']);
      },
      error: err => {
        console.error('Error actualizando cliente:', err);
        this.submitting = false;
        alert('Error al editar el cliente. Revisa la consola.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}
