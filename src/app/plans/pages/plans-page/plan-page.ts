import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../iam/services/auth.service';
import { PlansService } from '../../services/plans.service';
import { ClientsService } from '../../../clients/services/clients.service';
import { PropertiesService } from '../../../properties/services/properties.service';

import { Plan } from '../../model/plan.entity';
import { Client } from '../../../clients/model/client.entity';
import { Property } from '../../../properties/model/property.entity';
import { PlanList } from '../../components/plan-list/plan-list';

@Component({
  selector: 'app-plan-page',
  standalone: true,
  imports: [CommonModule, PlanList],
  templateUrl: './plan-page.html',
  styleUrl: './plan-page.css',
})
export class PlanPage implements OnInit {

  plans: Plan[] = [];
  clients: Client[] = [];
  properties: Property[] = [];

  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private plansService: PlansService,
    private clientsService: ClientsService,
    private propertiesService: PropertiesService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    const salesManId = this.authService.getCurrentSalesManId();

    this.plansService.getAll().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando créditos', err);
        this.error = 'Error al cargar los créditos.';
        this.loading = false;
      }
    });

    this.clientsService.getClientsBySalesman(salesManId).subscribe({
      next: (clients) => this.clients = clients,
      error: (err) => console.error('Error cargando clientes', err)
    });

    this.propertiesService.getPropertiesBySalesman(salesManId).subscribe({
      next: (props) => this.properties = props,
      error: (err) => console.error('Error cargando propiedades', err)
    });
  }

  onCreate(): void {
    this.router.navigate(['/plans/create']);
  }
}
