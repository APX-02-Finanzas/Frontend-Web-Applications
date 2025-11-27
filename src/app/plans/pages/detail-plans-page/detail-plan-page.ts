import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Installment} from '../../model/installment.entity';
import {PlansService} from '../../services/plans.service';

@Component({
  selector: 'app-detail-plan-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-plan-page.html',
  styleUrl: './detail-plan-page.css',
})
export class DetailPlanPage implements OnInit {

  paymentPlanId!: number;
  installments: Installment[] = [];

  isLoading = false;
  errorMessage = '';
  currency: 'PEN' | 'USD' = 'PEN';

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

    this.loadInstallments();
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
    d.setMonth(d.getMonth() + installment.number);
    return d;
  }
  onCancel(): void {
    this.router.navigate(['/plans']);
  }

  setCurrency(mode: 'PEN' | 'USD'): void {
    this.currency = mode;
  }

  get exchangeRate(): number {
    return this.currency === 'PEN' ? 1 : 3.5;
  }
}
