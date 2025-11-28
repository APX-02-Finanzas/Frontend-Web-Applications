import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../model/client.entity';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';

@Component({
  standalone: true,
  selector: 'app-client-card',
  imports: [CommonModule],
  templateUrl: './client-card.html',
  styleUrls: ['./client-card.css']
})
export class ClientCard {
  @Input() client!: Client;
  @Output() deleted = new EventEmitter<number>();

  constructor(private router: Router, private clientsService: ClientsService) {}

  onEdit(): void {
    if (this.client == null || this.client.id == null) return;
    this.router.navigate(['/clients/edit', this.client.id]);
  }

  onDelete(): void {
    if (this.client == null || this.client.id == null) return;

    this.clientsService.delete(this.client.id).subscribe({
      next: () => {
        this.deleted.emit(this.client.id);
      },
      error: () => alert('Error al eliminar')
    });
  }
}
