import { Component, OnInit } from '@angular/core';
import {Property} from '../../model/property.entity';
import {PropertiesService} from '../../services/properties.service';
import { AuthService } from '../../../iam/services/auth.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {PropertyList} from '../../components/property-list/property-list';


@Component({
  selector: 'app-properties-page',
  imports: [
    CommonModule,
    PropertyList
  ],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
  standalone: true
})
export class PropertiesPage implements OnInit {
  properties: Property[] = [];
  loading = true;
  error = '';

  constructor(
    private propertiesService: PropertiesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.error = '';

    const salesManId = this.authService.getCurrentSalesManId();

    if (!salesManId) {
      this.error = 'No se pudo identificar al vendedor';
      this.loading = false;
      return;
    }

    this.propertiesService.getPropertiesBySalesman(salesManId).subscribe({
      next: (properties) => {
        this.properties = (properties || [])
          .slice()
          .sort((a, b) => (a.id || 0) - (b.id || 0));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading inmobiliarios:', err);
        this.error = 'Error al cargar las inmobiliarios';
        this.loading = false;
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/properties/create']);
  }
}
