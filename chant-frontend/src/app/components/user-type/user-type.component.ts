import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css'],
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
export class UserTypeComponent {
  constructor(private router: Router) {}

  selectExistingUser(): void {
    // Navigate directly to add chant page with existing username mode
    this.router.navigate(['/add-chant'], { queryParams: { mode: 'username', userType: 'existing' } });
  }

  selectNewUser(): void {
    // Navigate to the create username page
    this.router.navigate(['/create-username']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}