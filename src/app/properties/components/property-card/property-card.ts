import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Property} from '../../model/property.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-property-card',
  imports: [
    CommonModule
  ],
  templateUrl: './property-card.html',
  styleUrl: './property-card.css',
  standalone: true
})
export class PropertyCard {
  @Input() property!: Property;

  constructor(private router: Router) {}

  onEdit(): void {
    if (!this.property || !this.property.id) return;
    this.router.navigate(['/properties/edit', this.property.id]);
  }
}
