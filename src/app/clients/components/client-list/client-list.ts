import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../model/client.entity';
import { ClientCard } from '../client-card/client-card';

@Component({
  standalone: true,
  selector: 'app-client-list',
  imports: [CommonModule, ClientCard],
  templateUrl: './client-list.html',
  styleUrls: ['./client-list.css']
})
export class ClientList {
  @Input() clients: Client[] = [];
}
