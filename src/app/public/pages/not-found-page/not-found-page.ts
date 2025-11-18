import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-not-found-page',
  imports: [CommonModule],
  templateUrl: './not-found-page.html',
  styleUrls: ['./not-found-page.css']
})
export class NotFoundPage {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/clients']);
  }
}
