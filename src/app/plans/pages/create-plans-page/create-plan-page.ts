import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PlansService } from '../../services/plans.service';
import { AuthService } from '../../../iam/services/auth.service';
import { Client } from '../../../clients/model/client.entity';
import { Property } from '../../../properties/model/property.entity';
import { PropertiesService } from '../../../properties/services/properties.service';
import { ClientsService } from '../../../clients/services/clients.service';

@Component({
  selector: 'app-create-plan-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-plan-page.html',
  styleUrl: './create-plan-page.css',
})
export class CreatePlanPage implements OnInit {
  form: FormGroup;
  submitting = false;

  interestRateTypes = ['TEA', 'TNA'];

  clients: Client[] = [];
  properties: Property[] = [];

  constructor(
    private fb: FormBuilder,
    private plansService: PlansService,
    private propertiesService: PropertiesService,
    private clientsService: ClientsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      // Selección
      clientId: [null, Validators.required],
      propertyId: [null, Validators.required],

      // Datos del plan
      downPaymentPercentage: [10, [Validators.required, Validators.min(0)]],
      years: [20, [Validators.required, Validators.min(1)]],
      paymentFrequency: [30, [Validators.required, Validators.min(1)]],
      daysPerYear: [360, [Validators.required, Validators.min(1)]],

      // Costos iniciales
      notarialCosts: [0, [Validators.min(0)]],
      registryCosts: [0, [Validators.min(0)]],
      appraisal: [0, [Validators.min(0)]],
      studyCommission: [0, [Validators.min(0)]],
      activationCommission: [0, [Validators.min(0)]],

      // Costos periódicos
      periodicCommission: [0, [Validators.min(0)]],
      postage: [0, [Validators.min(0)]],
      administrationFees: [0, [Validators.min(0)]],
      creditLifeInsurance: [0, [Validators.min(0)]],
      riskInsurance: [0, [Validators.min(0)]],

      // Tasas
      discountRate: [0, [Validators.min(0)]],
      interestRateType: ['TEA', Validators.required],
      annualInterestRate: [0, [Validators.required, Validators.min(0)]],

      // Bono (si lo usas)
      applyBono: [false],

      // Configuración avanzada
      graceConfigs: this.fb.array([
        this.createGraceConfigGroup()
      ]),
      prepaymentConfigs: this.fb.array([
        this.createPrepaymentConfigGroup()
      ]),
      rateChangeConfigs: this.fb.array([
        this.createRateConfigGroup()
      ])
    });
  }


  private createGraceConfigGroup(): FormGroup {
    return this.fb.group({
      installments: [''],
      gracePeriodType: ['']
    });
  }

  private createPrepaymentConfigGroup(): FormGroup {
    return this.fb.group({
      installments: [''],
      prepaymentAmount: [null]
    });
  }

  private createRateConfigGroup(): FormGroup {
    return this.fb.group({
      installments: [''],
      newAnnualRate: [null]
    });
  }

  get graceConfigs(): FormArray {
    return this.form.get('graceConfigs') as FormArray;
  }

  get prepaymentConfigs(): FormArray {
    return this.form.get('prepaymentConfigs') as FormArray;
  }

  get rateChangeConfigs(): FormArray {
    return this.form.get('rateChangeConfigs') as FormArray;
  }

  addGraceConfig(): void {
    this.graceConfigs.push(this.createGraceConfigGroup());
  }

  removeGraceConfig(index: number): void {
    if (this.graceConfigs.length > 1) {
      this.graceConfigs.removeAt(index);
    }
  }

  addPrepaymentConfig(): void {
    this.prepaymentConfigs.push(this.createPrepaymentConfigGroup());
  }

  removePrepaymentConfig(index: number): void {
    if (this.prepaymentConfigs.length > 1) {
      this.prepaymentConfigs.removeAt(index);
    }
  }

  addRateConfig(): void {
    this.rateChangeConfigs.push(this.createRateConfigGroup());
  }

  removeRateConfig(index: number): void {
    if (this.rateChangeConfigs.length > 1) {
      this.rateChangeConfigs.removeAt(index);
    }
  }


  private parseInstallments(raw: string | null | undefined): number[] {
    if (!raw) return [];

    const numbers: number[] = [];

    raw.split(',').forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;

      const rangeParts = trimmed.split('-').map(p => p.trim());

      if (rangeParts.length === 1) {
        const n = Number(rangeParts[0]);
        if (Number.isFinite(n) && n > 0) numbers.push(n);
        return;
      }

      if (rangeParts.length === 2) {
        let start = Number(rangeParts[0]);
        let end = Number(rangeParts[1]);
        if (!Number.isFinite(start) || !Number.isFinite(end)) return;

        if (start > end) [start, end] = [end, start];

        for (let i = start; i <= end; i++) {
          numbers.push(i);
        }
      }
    });

    return Array.from(new Set(numbers)).sort((a, b) => a - b);
  }


  ngOnInit(): void {
    this.loadClients();
    this.loadProperties();
  }

  private loadClients(): void {
    const salesManId = this.authService.getCurrentSalesManId();
    if (!salesManId && salesManId !== 0) {
      console.warn('No se encontró salesManId para cargar clientes');
      return;
    }

    this.clientsService.getClientsBySalesman(salesManId).subscribe({
      next: (clients) => (this.clients = clients),
      error: (err) => {
        console.error('Error cargando clientes', err);
        this.clients = [];
      }
    });
  }

  private loadProperties(): void {
    const salesManId = this.authService.getCurrentSalesManId();
    if (!salesManId && salesManId !== 0) {
      console.warn('No se encontró salesManId para cargar propiedades');
      return;
    }

    this.propertiesService.getPropertiesBySalesman(salesManId).subscribe({
      next: (props) => (this.properties = props),
      error: (err) => {
        console.error('Error cargando propiedades', err);
        this.properties = [];
      }
    });
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const salesManId = this.authService.getCurrentSalesManId();
    if (!salesManId && salesManId !== 0) {
      alert('No se pudo identificar al vendedor actual.');
      this.submitting = false;
      return;
    }

    const interestRateTypeControl =
      (this.form.get('interestRateType')?.value ?? 'TEA').toString();

    const daysPerYear =
      Number(this.form.get('daysPerYear')?.value) || 360;
    const paymentFrequency =
      Number(this.form.get('paymentFrequency')?.value) || 30;

    const m = daysPerYear / paymentFrequency;

    const toTeaIfTna = (ratePercent: number): number => {
      if (interestRateTypeControl !== 'TNA') return ratePercent;
      const nominal = ratePercent / 100;
      const tea = Math.pow(1 + nominal / m, m) - 1;
      return tea * 100;
    };

    const gracePeriods = this.graceConfigs.controls.reduce((acc, group) => {
      const installmentsRaw = group.get('installments')?.value as string;
      const type = (group.get('gracePeriodType')?.value ?? '').toString().trim();
      const installments = this.parseInstallments(installmentsRaw);

      if (!type || installments.length === 0) return acc;

      installments.forEach(n => {
        acc.push({ installmentNumber: n, gracePeriodType: type });
      });

      return acc;
    }, [] as { installmentNumber: number; gracePeriodType: string }[]);

    // --- Prepayments por rangos ---
    const prepayments = this.prepaymentConfigs.controls.reduce((acc, group) => {
      const installmentsRaw = group.get('installments')?.value as string;
      const amount = Number(group.get('prepaymentAmount')?.value) || 0;
      const installments = this.parseInstallments(installmentsRaw);

      if (amount <= 0 || installments.length === 0) return acc;

      installments.forEach(n => {
        acc.push({ installmentNumber: n, prepaymentAmount: amount });
      });

      return acc;
    }, [] as { installmentNumber: number; prepaymentAmount: number }[]);

    const interestRateConfigs = this.rateChangeConfigs.controls.reduce((acc, group) => {
      const installmentsRaw = group.get('installments')?.value as string;
      let newAnnualRate = Number(group.get('newAnnualRate')?.value) || 0;
      const installments = this.parseInstallments(installmentsRaw);

      if (newAnnualRate <= 0 || installments.length === 0) return acc;

      newAnnualRate = toTeaIfTna(newAnnualRate);

      installments.forEach(n => {
        acc.push({ installmentNumber: n, newAnnualRate });
      });

      return acc;
    }, [] as { installmentNumber: number; newAnnualRate: number }[]);

    const annualRateInput =
      Number(this.form.get('annualInterestRate')?.value) || 0;
    const annualRateToSend = toTeaIfTna(annualRateInput);

    const payload = {
      clientId: Number(this.form.get('clientId')?.value),
      propertyId: Number(this.form.get('propertyId')?.value),
      salesManId,

      applyBono: !!this.form.get('applyBono')?.value,

      downPaymentPercentage:
        Number(this.form.get('downPaymentPercentage')?.value) || 0,
      years:
        Number(this.form.get('years')?.value) || 0,
      paymentFrequency:
        Number(this.form.get('paymentFrequency')?.value) || 0,
      daysPerYear:
        Number(this.form.get('daysPerYear')?.value) || 0,

      notarialCosts:
        Number(this.form.get('notarialCosts')?.value) || 0,
      registryCosts:
        Number(this.form.get('registryCosts')?.value) || 0,
      appraisal:
        Number(this.form.get('appraisal')?.value) || 0,
      studyCommission:
        Number(this.form.get('studyCommission')?.value) || 0,
      activationCommission:
        Number(this.form.get('activationCommission')?.value) || 0,

      periodicCommission:
        Number(this.form.get('periodicCommission')?.value) || 0,
      postage:
        Number(this.form.get('postage')?.value) || 0,
      administrationFees:
        Number(this.form.get('administrationFees')?.value) || 0,
      creditLifeInsurance:
        Number(this.form.get('creditLifeInsurance')?.value) || 0,
      riskInsurance:
        Number(this.form.get('riskInsurance')?.value) || 0,

      discountRate:
        Number(this.form.get('discountRate')?.value) || 0,

      interestRateType: 'TEA',
      annualInterestRate: annualRateToSend,

      gracePeriods,
      prepayments,
      interestRateConfigs
    };

    this.plansService.create(payload as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/plans']);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error creating plan:', err);
        alert('Error al crear el plan de financiamiento. Revisa la consola.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/plans']);
  }
}
