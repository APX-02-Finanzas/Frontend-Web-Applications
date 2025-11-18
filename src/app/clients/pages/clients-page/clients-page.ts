import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsService } from '../../services/clients.service';
import { AuthService } from '../../../iam/services/auth.service';
import { ClientList } from '../../components/client-list/client-list';
import { Client } from '../../model/client.entity';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-clients-page',
  imports: [CommonModule, ClientList],
  templateUrl: './clients-page.html',
  styleUrls: ['./clients-page.css']
})
export class ClientsPage implements OnInit {
  clients: Client[] = [];
  loading = true;
  error = '';

  constructor(
    private clientService: ClientsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.error = '';

    const salesManId = this.authService.getCurrentSalesManId();

    if (!salesManId) {
      this.error = 'No se pudo identificar al vendedor';
      this.loading = false;
      return;
    }

    this.clientService.getClientsBySalesman(salesManId).subscribe({
      next: (clients) => {
        this.clients = (clients || []).slice().sort((a, b) => (a.id || 0) - (b.id || 0));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.error = 'Error al cargar los clientes';
        this.loading = false;
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/clients/create']);
  }
}
