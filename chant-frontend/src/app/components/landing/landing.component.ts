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
    ])
  ]
})
export class LandingComponent {
  constructor(private router: Router) {}

  selectPhoneOption(): void {
    // Navigate directly to add chant page with phone mode
    this.router.navigate(['/add-chant'], { queryParams: { mode: 'phone' } });
  }

  selectUsernameOption(): void {
    // Navigate to user type selection page
    this.router.navigate(['/user-type']);
  }
}