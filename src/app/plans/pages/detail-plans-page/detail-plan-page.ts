import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Installment} from '../../model/installment.entity';
import {Plan} from '../../model/plan.entity';
import {PlansService} from '../../services/plans.service';

@Component({
  selector: 'app-detail-plan-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-plan-page.html',
  styleUrl: './detail-plan-page.css',
})
export class DetailPlanPage implements OnInit {

  plan!: Plan;
  paymentFrequency!: number;

  paymentPlanId!: number;
  installments: Installment[] = [];

  isLoading = false;
  errorMessage = '';
  currency: 'PEN' | 'USD'| 'EUR' = 'PEN';

  startDate: Date = new Date(2025, 0, 1);

  constructor(
    private plansService: PlansService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idFromRoute =
      this.route.snapshot.paramMap.get('paymentPlanId') ??
      this.route.snapshot.paramMap.get('id');

    this.paymentPlanId = Number(idFromRoute);

    if (!this.paymentPlanId) {
      this.errorMessage = 'No se encontró el ID del plan de pago en la ruta.';
      return;
    }

    this.plansService.getById(this.paymentPlanId).subscribe({
      next: (plan) => {
        this.plan = plan;
        this.paymentFrequency = plan.paymentFrequency;
        this.loadInstallments();
      },
      error: () => {
        this.errorMessage = 'Error al cargar datos del plan.';
      }
    });
  }

  loadInstallments(): void {
    this.isLoading = true;
    this.plansService.getInstallmentsByPlan(this.paymentPlanId)
      .subscribe({
        next: (data) => {
          this.installments = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Ocurrió un error al cargar las cuotas.';
          this.isLoading = false;
        }
      });
  }

  getInstallmentDate(installment: Installment): Date {
    const d = new Date(this.startDate);

    // Frecuencia real según el plan
    const freq = this.paymentFrequency;

    // Sumar la cantidad de días según la frecuencia
    const daysToAdd = installment.number * freq;

    d.setDate(d.getDate() + daysToAdd);

    return d;
  }
  onCancel(): void {
    this.router.navigate(['/plans']);
  }

  setCurrency(mode: 'PEN' | 'USD'| 'EUR'): void {
    this.currency = mode;
  }

  get exchangeRate(): number {
    if (this.currency === 'PEN') return 1;
    if (this.currency === 'USD') return 3.5;
    if (this.currency === 'EUR') return 4.0;

    return 1;
  }
}
