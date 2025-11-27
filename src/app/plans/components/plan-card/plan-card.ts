// plan-card.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Plan } from '../../model/plan.entity';
import { Client } from '../../../clients/model/client.entity';
import { Property } from '../../../properties/model/property.entity';

@Component({
  selector: 'app-plan-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-card.html',
  styleUrl: './plan-card.css',
})
export class PlanCard {
  @Input() plan!: Plan;
  @Input() client: Client | null = null;
  @Input() property: Property | null = null;
  @Input() index?: number;

  @Output() deleted = new EventEmitter<number>();

  constructor(private router: Router) {}

  onEdit(): void {
    if (!this.plan || !this.plan.id) return;

    this.router.navigate(['/plans/edit', this.plan.id], {
      state: { plan: this.plan }
    });
  }

  onViewDetail(): void {
    if (!this.plan || !this.plan.id) return;
    this.router.navigate(['/plans', this.plan.id]);
  }

  onDelete(): void {
    if (!this.plan || !this.plan.id) return;
    this.deleted.emit(this.plan.id);
  }

}
