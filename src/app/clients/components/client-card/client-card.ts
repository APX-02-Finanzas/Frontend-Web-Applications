import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../model/client.entity';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-client-card',
  imports: [CommonModule],
  templateUrl: './client-card.html',
  styleUrls: ['./client-card.css']
})
export class ClientCard {
  @Input() client!: Client;

  constructor(private router: Router) {}

  onEdit(): void {
    if (!this.client || !this.client.id) return;
    this.router.navigate(['/clients/edit', this.client.id]);
  }
}
