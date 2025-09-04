import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../services/api.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-create-username',
  templateUrl: './create-username.component.html',
  styleUrls: ['./create-username.component.css'],
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
export class CreateUsernameComponent implements OnInit {
  usernameForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
    this.usernameForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^[A-Za-z0-9]+$/)
      ]],
      confirmUsername: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  // Custom validator to check if username and confirm username match
  passwordMatchValidator(form: FormGroup) {
    const username = form.get('username');
    const confirmUsername = form.get('confirmUsername');
    
    if (username && confirmUsername && username.value !== confirmUsername.value) {
      confirmUsername.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (confirmUsername && confirmUsername.hasError('mismatch')) {
        delete confirmUsername.errors?.['mismatch'];
        if (Object.keys(confirmUsername.errors || {}).length === 0) {
          confirmUsername.setErrors(null);
        }
      }
      return null;
    }
  }

  onSubmit(): void {
    if (this.usernameForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const username = this.usernameForm.get('username')?.value;
    this.createUser(username);
  }

  private createUser(username: string): void {
    this.isLoading = true;
    const createUserRequest = { userid: username };

    this.apiService.createUser(createUserRequest).subscribe({
      next: (response: ApiResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.showMessage('Username created successfully!', 'success');
          // Navigate to add-chant page as existing user with the created username
          this.router.navigate(['/add-chant'], { 
            queryParams: { 
              mode: 'username', 
              userType: 'existing',
              username: username 
            } 
          });
        } else {
          // Handle specific error messages
          if (response.message.toLowerCase().includes('already exists') || 
              response.message.toLowerCase().includes('user exists')) {
            this.showMessage('This username already exists. Please choose a different username.', 'error');
            // Focus back on username field
            setTimeout(() => {
              const usernameField = document.querySelector('input[formControlName="username"]') as HTMLInputElement;
              if (usernameField) {
                usernameField.focus();
                usernameField.select();
              }
            }, 100);
          } else {
            this.showMessage(response.message, 'error');
          }
        }
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.isLoading = false;
        this.showMessage('Error creating username. Please try again.', 'error');
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.usernameForm.controls).forEach(key => {
      const control = this.usernameForm.get(key);
      control?.markAsTouched();
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

  goBack(): void {
    this.router.navigate(['/user-type']);
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
