import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PlansService } from '../../services/plans.service';
import { Plan, InterestRateConfig } from '../../model/plan.entity';

@Component({
  selector: 'app-edit-plan-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-plan-page.html',
  styleUrl: './edit-plan-page.css',
})
export class EditPlanPage implements OnInit {

  form: FormGroup;
  loading = true;
  submitting = false;
  error = '';

  planId = 0;

  interestRateTypes = ['TEA'];
  currencyOptions = ['PEN', 'USD', 'EUR'];
  graceTypes = ['T', 'P', 'S'];

  constructor(
    private fb: FormBuilder,
    private plansService: PlansService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      // Datos generales
      assetSalePrice: [0, [Validators.required, Validators.min(0)]],
      downPaymentPercentage: [0, [Validators.required, Validators.min(0)]],
      years: [0, [Validators.required, Validators.min(1)]],
      paymentFrequency: [0, [Validators.required, Validators.min(1)]],
      daysPerYear: [0, [Validators.required, Validators.min(1)]],

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
      annualInterestRate: [0, [Validators.min(0)]],
      interestRateType: ['TEA', Validators.required],
      currency: ['PEN', Validators.required],

      // Reconfig de tasa
      interestInstallmentNumber: [0, [Validators.min(0)]],
      newAnnualRate: [0, [Validators.min(0)]],

      // Periodo de gracia
      graceInstallmentNumber: [0, [Validators.min(0)]],
      gracePeriodType: ['T', Validators.required],

      // Prepago
      prepaymentInstallmentNumber: [0, [Validators.min(0)]],
      prepaymentAmount: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'Id del plan no proporcionado';
      this.loading = false;
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error = 'Id del plan inválido';
      this.loading = false;
      return;
    }

    this.planId = id;

    // Si vienes navegando con el plan ya cargado
    const navState = history.state as { plan?: Plan };
    if (navState && navState.plan) {
      this.patchFormWithPlan(navState.plan);
      this.loading = false;
      return;
    }

    // Si no, lo pides al backend
    this.plansService.getById(id).subscribe({
      next: (plan) => {
        this.patchFormWithPlan(plan);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando plan:', err);
        this.error = 'Error al cargar el plan de financiamiento.';
        this.loading = false;
      }
    });
  }

  private patchFormWithPlan(p: Plan): void {
    this.form.patchValue({
      // Datos generales
      assetSalePrice: p.assetSalePrice ?? 0,
      downPaymentPercentage: p.downPaymentPercentage ?? 0,
      years: p.years ?? 0,
      paymentFrequency: p.paymentFrequency ?? 0,
      daysPerYear: p.daysPerYear ?? 0,

      // Costos iniciales
      notarialCosts: p.notarialCosts ?? 0,
      registryCosts: p.registryCosts ?? 0,
      appraisal: p.appraisal ?? 0,
      studyCommission: p.studyCommission ?? 0,
      activationCommission: p.activationCommission ?? 0,

      // Costos periódicos
      periodicCommission: p.periodicCommission ?? 0,
      postage: p.postage ?? 0,
      administrationFees: p.administrationFees ?? 0,
      creditLifeInsurance: p.creditLifeInsurance ?? 0,
      riskInsurance: p.riskInsurance ?? 0,

      // Tasas
      discountRate: p.discountRate ?? 0,
      annualInterestRate: p.annualInterestRate ?? 0,
      interestRateType: p.interestRateType ?? 'TEA',
      currency: p.currency ?? 'PEN',

      graceInstallmentNumber: 0,
      gracePeriodType: 'T',
      prepaymentInstallmentNumber: 0,
      prepaymentAmount: 0,
    });

    if (p.interestRateConfigs && p.interestRateConfigs.length > 0) {
      const firstCfg = p.interestRateConfigs[0];
      this.form.patchValue({
        interestInstallmentNumber: firstCfg.installmentNumber ?? 0,
        newAnnualRate: firstCfg.newAnnualRate ?? 0
      });
    } else {
      this.form.patchValue({
        interestInstallmentNumber: 0,
        newAnnualRate: 0
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;


    const interestRateConfigs: InterestRateConfig[] = [];
    const interestInstallmentNumber =
      Number(this.form.get('interestInstallmentNumber')?.value) || 0;
    const newAnnualRate =
      Number(this.form.get('newAnnualRate')?.value) || 0;

    if (interestInstallmentNumber > 0 && newAnnualRate > 0) {
      interestRateConfigs.push({
        installmentNumber: interestInstallmentNumber,
        newAnnualRate: newAnnualRate
      });
    }

    const gracePeriods: any[] = [];
    const graceInstallmentNumber =
      Number(this.form.get('graceInstallmentNumber')?.value) || 0;
    const gracePeriodType =
      (this.form.get('gracePeriodType')?.value ?? 'T').toString();

    if (graceInstallmentNumber > 0) {
      gracePeriods.push({
        installmentNumber: graceInstallmentNumber,
        gracePeriodType: gracePeriodType
      });
    }

    // prepayments
    const prepayments: any[] = [];
    const prepaymentInstallmentNumber =
      Number(this.form.get('prepaymentInstallmentNumber')?.value) || 0;
    const prepaymentAmount =
      Number(this.form.get('prepaymentAmount')?.value) || 0;

    if (prepaymentInstallmentNumber > 0 && prepaymentAmount > 0) {
      prepayments.push({
        installmentNumber: prepaymentInstallmentNumber,
        prepaymentAmount: prepaymentAmount
      });
    }

    const payload: any = {
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
      interestRateType:
        (this.form.get('interestRateType')?.value ?? 'TEA').toString(),
      annualInterestRate:
        Number(this.form.get('annualInterestRate')?.value) || 0,

      // No está en tu JSON de ejemplo, pero tu Plan y tu form lo manejan
      assetSalePrice:
        Number(this.form.get('assetSalePrice')?.value) || 0,
      currency:
        (this.form.get('currency')?.value ?? 'PEN').toString(),

      interestRateConfigs,
      gracePeriods,
      prepayments
    };

    this.plansService.update(this.planId, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/plans']);
      },
      error: (err) => {
        console.error('Error actualizando plan:', err);
        this.submitting = false;
        alert('Error al editar el plan de financiamiento. Revisa la consola.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/plans']);
  }
}
