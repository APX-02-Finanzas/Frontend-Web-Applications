import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PlansService } from '../../services/plans.service';
import { AuthService } from '../../../iam/services/auth.service';
import {Client} from '../../../clients/model/client.entity';
import {Property} from '../../../properties/model/property.entity';
import {PropertiesService} from '../../../properties/services/properties.service';
import {ClientsService} from '../../../clients/services/clients.service';


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

  interestRateTypes = ['TEA'];

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

      // Bono
      applyBono: [false],

      graceInstallment: [null],
      gracePeriodType: [''],
      prepaymentInstallment: [null],
      prepaymentAmount: [null],
      rateChangeInstallment: [null],
      rateChangeAnnual: [null]
    });
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

    const graceInstallment = Number(this.form.get('graceInstallment')?.value);
    const gracePeriodType = (this.form.get('gracePeriodType')?.value ?? '').toString();

    const prepaymentInstallment = Number(this.form.get('prepaymentInstallment')?.value);
    const prepaymentAmount = Number(this.form.get('prepaymentAmount')?.value);

    const rateChangeInstallment = Number(this.form.get('rateChangeInstallment')?.value);
    const rateChangeAnnual = Number(this.form.get('rateChangeAnnual')?.value);

    const gracePeriods =
      graceInstallment > 0 && gracePeriodType
        ? [{ installmentNumber: graceInstallment, gracePeriodType }]
        : [];

    const prepayments =
      prepaymentInstallment > 0 && prepaymentAmount > 0
        ? [{ installmentNumber: prepaymentInstallment, prepaymentAmount }]
        : [];

    const interestRateConfigs =
      rateChangeInstallment > 0 && rateChangeAnnual > 0
        ? [{ installmentNumber: rateChangeInstallment, newAnnualRate: rateChangeAnnual }]
        : [];

    const payload = {
      clientId: Number(this.form.get('clientId')?.value),
      propertyId: Number(this.form.get('propertyId')?.value),
      salesManId: salesManId,

      applyBono: !!this.form.get('applyBono')?.value,

      downPaymentPercentage: Number(this.form.get('downPaymentPercentage')?.value) || 0,
      years: Number(this.form.get('years')?.value) || 0,
      paymentFrequency: Number(this.form.get('paymentFrequency')?.value) || 0,
      daysPerYear: Number(this.form.get('daysPerYear')?.value) || 0,

      notarialCosts: Number(this.form.get('notarialCosts')?.value) || 0,
      registryCosts: Number(this.form.get('registryCosts')?.value) || 0,
      appraisal: Number(this.form.get('appraisal')?.value) || 0,
      studyCommission: Number(this.form.get('studyCommission')?.value) || 0,
      activationCommission: Number(this.form.get('activationCommission')?.value) || 0,

      periodicCommission: Number(this.form.get('periodicCommission')?.value) || 0,
      postage: Number(this.form.get('postage')?.value) || 0,
      administrationFees: Number(this.form.get('administrationFees')?.value) || 0,
      creditLifeInsurance: Number(this.form.get('creditLifeInsurance')?.value) || 0,
      riskInsurance: Number(this.form.get('riskInsurance')?.value) || 0,

      discountRate: Number(this.form.get('discountRate')?.value) || 0,
      interestRateType: (this.form.get('interestRateType')?.value ?? 'TEA').toString(),
      annualInterestRate: Number(this.form.get('annualInterestRate')?.value) || 0,

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
