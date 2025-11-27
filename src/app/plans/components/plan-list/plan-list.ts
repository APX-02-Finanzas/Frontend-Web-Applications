// plan-list.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plan } from '../../model/plan.entity';
import { PlanCard } from '../plan-card/plan-card';
import { Client } from '../../../clients/model/client.entity';
import { Property } from '../../../properties/model/property.entity';

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [
    CommonModule,
    PlanCard
  ],
  templateUrl: './plan-list.html',
  styleUrl: './plan-list.css',
})
export class PlanList {
  @Input() plans: Plan[] = [];
  @Input() clients: Client[] = [];
  @Input() properties: Property[] = [];

  @Output() deleted = new EventEmitter<number>();

  getClient(clientId: number | undefined): Client | null {
    if (!clientId) return null;
    return this.clients.find(c => c.id === clientId) ?? null;
  }

  getProperty(propertyId: number | undefined): Property | null {
    if (!propertyId) return null;
    return this.properties.find(p => p.id === propertyId) ?? null;
  }

  onChildDeleted(id: number) {
    this.deleted.emit(id);
  }
}
