import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Property} from '../../model/property.entity';
import {PropertyCard} from '../property-card/property-card';

@Component({
  selector: 'app-property-list',
  imports: [
    CommonModule,
    PropertyCard,
    //PropertyCard
  ],
  templateUrl: './property-list.html',
  styleUrl: './property-list.css',
  standalone: true
})
export class PropertyList {
  @Input() properties: Property[] = [];
  @Output() deleted = new EventEmitter<number>();

  onDeleted(id: number) {
    this.deleted.emit(id);
  }
}
