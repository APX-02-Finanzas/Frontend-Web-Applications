import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Property} from '../../model/property.entity';
import { Router } from '@angular/router';
import { PropertiesService } from '../../services/properties.service';


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
  @Output() deleted = new EventEmitter<number>();

  constructor(private router: Router,
              private propertiesService: PropertiesService) {}

  onEdit(): void {
    if (!this.property || !this.property.id) return;
    this.router.navigate(['/properties/edit', this.property.id]);
  }

  onDelete(): void {

    this.propertiesService.deleteProperty(this.property.id).subscribe({
      next: () => {
        this.deleted.emit(this.property.id);
      },
      error: () => alert("Error al eliminar")
    });
  }

}
