import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-no-access-page',
  imports: [CommonModule],
  templateUrl: './no-access-page.html',
  styleUrls: ['./no-access-page.css']
})
export class NoAccessPage {
  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }

  goHome(): void {
    this.router.navigate(['/clients']);
  }
}
