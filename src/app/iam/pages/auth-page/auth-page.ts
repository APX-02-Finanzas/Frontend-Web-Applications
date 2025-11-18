import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInBox } from '../../components/sign-in-box/sign-in-box';
import { SignUpBox } from '../../components/sign-up-box/sign-up-box';

@Component({
  standalone: true,
  selector: 'app-auth-page',
  imports: [CommonModule, SignInBox, SignUpBox],
  templateUrl: './auth-page.html',
  styleUrls: ['./auth-page.css'],
})
export class AuthPage {
  showSignIn = true;

  onSwitch(mode: 'sign-in' | 'sign-up') {
    this.showSignIn = (mode === 'sign-in');
  }
}
