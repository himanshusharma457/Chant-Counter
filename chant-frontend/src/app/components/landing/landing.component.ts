import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LandingComponent {
  selectedOption: 'phone' | 'username' | null = null;

  constructor(private router: Router) {}

  selectPhoneOption(): void {
    this.selectedOption = 'phone';
  }

  selectUsernameOption(): void {
    this.selectedOption = 'username';
  }

  continueWithSelection(): void {
    if (this.selectedOption === 'phone') {
      // Navigate directly to add chant page with phone mode
      this.router.navigate(['/add-chant'], { queryParams: { mode: 'phone' } });
    } else if (this.selectedOption === 'username') {
      // Navigate to user type selection page
      this.router.navigate(['/user-type']);
    }
  }
}