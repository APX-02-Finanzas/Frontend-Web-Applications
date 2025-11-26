import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Plan } from '../model/plan.entity';
import { environment } from '../../../environments/environment';
import { Installment } from '../model/installment.entity';
import { catchError, map, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlansService extends BaseService<Plan> {

  constructor() {
    super();
    this.resourceEndpoint = environment.creditsEndpointPath;
  }

  getInstallmentsByPlan(paymentPlanId: number): Observable<Installment[]> {
    return this.http.get<Installment[]>(
      `${this.resourcePath()}/${paymentPlanId}/installments`,
      this.httpOptions
    ).pipe(
      retry(2),
      map(response => response.map(item => new Installment(item))),
      catchError(this.handleError)
    );
  }
}
