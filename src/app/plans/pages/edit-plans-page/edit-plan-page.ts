import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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

  interestRateTypes = ['TEA', 'TNA'];
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

      // Configuración avanzada en grupos (rangos)
      rateConfigs: this.fb.array([this.createRateConfigGroup()]),
      graceConfigs: this.fb.array([this.createGraceConfigGroup()]),
      prepaymentConfigs: this.fb.array([this.createPrepaymentConfigGroup()])
    });
  }


  private createRateConfigGroup(): FormGroup {
    return this.fb.group({
      installments: [''],
      newAnnualRate: [null, [Validators.min(0)]]
    });
  }

  private createGraceConfigGroup(): FormGroup {
    return this.fb.group({
      installments: [''],
      gracePeriodType: ['T', Validators.required]
    });
  }

  private createPrepaymentConfigGroup(): FormGroup {
    return this.fb.group({
      installments: [''],
      prepaymentAmount: [null, [Validators.min(0)]]
    });
  }

  get rateConfigs(): FormArray {
    return this.form.get('rateConfigs') as FormArray;
  }

  get graceConfigs(): FormArray {
    return this.form.get('graceConfigs') as FormArray;
  }

  get prepaymentConfigs(): FormArray {
    return this.form.get('prepaymentConfigs') as FormArray;
  }

  addRateConfig(): void {
    this.rateConfigs.push(this.createRateConfigGroup());
  }

  removeRateConfig(index: number): void {
    if (this.rateConfigs.length > 1) {
      this.rateConfigs.removeAt(index);
    }
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

      // rango a-b
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

  private numbersToCsv(nums: number[]): string {
    return [...nums].sort((a, b) => a - b).join(',');
  }

  private clearFormArray(arr: FormArray): void {
    while (arr.length > 0) {
      arr.removeAt(0);
    }
  }

  // ===== ciclo de vida =====

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

    const navState = history.state as { plan?: Plan };
    if (navState && navState.plan) {
      this.patchFormWithPlan(navState.plan);
      this.loading = false;
      return;
    }

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
      currency: p.currency ?? 'PEN'
    });

    // Configuración avanzada
    this.setRateConfigsFromPlan(p.interestRateConfigs || []);
    this.setGraceConfigsFromPlan((p as any).gracePeriods || []);
    this.setPrepaymentConfigsFromPlan((p as any).prepayments || []);
  }

  private setRateConfigsFromPlan(
    rateConfigs: { installmentNumber: number; newAnnualRate: number }[]
  ): void {
    this.clearFormArray(this.rateConfigs);

    if (!rateConfigs.length) {
      this.rateConfigs.push(this.createRateConfigGroup());
      return;
    }

    const groups = new Map<number, number[]>();

    rateConfigs.forEach(rc => {
      if (!groups.has(rc.newAnnualRate)) {
        groups.set(rc.newAnnualRate, []);
      }
      groups.get(rc.newAnnualRate)!.push(rc.installmentNumber);
    });

    groups.forEach((nums, rate) => {
      const fg = this.createRateConfigGroup();
      fg.patchValue({
        installments: this.numbersToCsv(nums),
        newAnnualRate: rate
      });
      this.rateConfigs.push(fg);
    });
  }

  private setGraceConfigsFromPlan(
    gracePeriods: { installmentNumber: number; gracePeriodType: string }[]
  ): void {
    this.clearFormArray(this.graceConfigs);

    if (!gracePeriods.length) {
      this.graceConfigs.push(this.createGraceConfigGroup());
      return;
    }

    const groups = new Map<string, number[]>();

    gracePeriods.forEach(gp => {
      if (!groups.has(gp.gracePeriodType)) {
        groups.set(gp.gracePeriodType, []);
      }
      groups.get(gp.gracePeriodType)!.push(gp.installmentNumber);
    });

    groups.forEach((nums, type) => {
      const fg = this.createGraceConfigGroup();
      fg.patchValue({
        installments: this.numbersToCsv(nums),
        gracePeriodType: type
      });
      this.graceConfigs.push(fg);
    });
  }

  private setPrepaymentConfigsFromPlan(
    prepayments: { installmentNumber: number; prepaymentAmount: number }[]
  ): void {
    this.clearFormArray(this.prepaymentConfigs);

    if (!prepayments.length) {
      this.prepaymentConfigs.push(this.createPrepaymentConfigGroup());
      return;
    }

    const groups = new Map<number, number[]>();

    prepayments.forEach(pp => {
      if (!groups.has(pp.prepaymentAmount)) {
        groups.set(pp.prepaymentAmount, []);
      }
      groups.get(pp.prepaymentAmount)!.push(pp.installmentNumber);
    });

    groups.forEach((nums, amount) => {
      const fg = this.createPrepaymentConfigGroup();
      fg.patchValue({
        installments: this.numbersToCsv(nums),
        prepaymentAmount: amount
      });
      this.prepaymentConfigs.push(fg);
    });
  }

  // ===== submit =====

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    // === Datos para conversión TNA -> TEA ===
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

    // === Cambios de tasa por rangos (convertimos a TEA si es TNA) ===
    const interestRateConfigs: InterestRateConfig[] =
      this.rateConfigs.controls.reduce(
        (acc, group) => {
          const installments = this.parseInstallments(
            group.get('installments')?.value
          );
          let newAnnualRate =
            Number(group.get('newAnnualRate')?.value) || 0;

          if (newAnnualRate <= 0 || installments.length === 0) return acc;

          // Normalizamos a TEA si el tipo global es TNA
          newAnnualRate = toTeaIfTna(newAnnualRate);

          installments.forEach(n => {
            acc.push({ installmentNumber: n, newAnnualRate });
          });

          return acc;
        },
        [] as InterestRateConfig[]
      );

    const gracePeriods: any[] = this.graceConfigs.controls.reduce(
      (acc, group) => {
        const installments = this.parseInstallments(
          group.get('installments')?.value
        );
        const gracePeriodType =
          (group.get('gracePeriodType')?.value ?? 'T').toString();

        if (!gracePeriodType || installments.length === 0) return acc;

        installments.forEach(n => {
          acc.push({ installmentNumber: n, gracePeriodType });
        });

        return acc;
      },
      [] as { installmentNumber: number; gracePeriodType: string }[]
    );

    const prepayments: any[] = this.prepaymentConfigs.controls.reduce(
      (acc, group) => {
        const installments = this.parseInstallments(
          group.get('installments')?.value
        );
        const prepaymentAmount =
          Number(group.get('prepaymentAmount')?.value) || 0;

        if (prepaymentAmount <= 0 || installments.length === 0) return acc;

        installments.forEach(n => {
          acc.push({ installmentNumber: n, prepaymentAmount });
        });

        return acc;
      },
      [] as { installmentNumber: number; prepaymentAmount: number }[]
    );

    // === Tasa anual principal normalizada (TEA) ===
    const annualRateInput =
      Number(this.form.get('annualInterestRate')?.value) || 0;
    const annualRateToSend = toTeaIfTna(annualRateInput);

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

      // Siempre TEA hacia el backend
      interestRateType: 'TEA',
      annualInterestRate: annualRateToSend,

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
