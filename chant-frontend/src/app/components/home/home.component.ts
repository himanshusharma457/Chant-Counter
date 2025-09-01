import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApiService, ApiResponse, UserTotalResponse, TotalChantsResponse } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
export class HomeComponent implements OnInit {
  chantForm: FormGroup;
  selectedTab = 0; // 0 for phone, 1 for custom user ID
  isLoading = false;
  userStats: UserTotalResponse | null = null;
  totalStats: TotalChantsResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.chantForm = this.fb.group({
      phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
      customUserId: ['', [Validators.minLength(8)]],
      count: ['', [Validators.required, Validators.min(1)]],
      date: ['', [this.futureDateValidator.bind(this)]] // Add future date validation
    });
  }

  ngOnInit(): void {
    this.updateValidators();
    this.loadTotalStats();
  }

  // Custom validator to prevent future dates
  futureDateValidator(control: any) {
    if (!control.value) {
      return null; // Allow empty values since date is optional
    }
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return { futureDate: true };
    }
    
    return null;
  }

  // Function to get the maximum selectable date (today)
  getMaxDate(): Date {
    return new Date();
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTab = event.index;
    this.updateValidators();
    this.userStats = null; // Clear previous user stats when switching tabs
  }

  private updateValidators(): void {
    const phoneControl = this.chantForm.get('phoneNumber');
    const customUserIdControl = this.chantForm.get('customUserId');

    if (this.selectedTab === 0) {
      // Phone number tab selected
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
      customUserIdControl?.clearValidators();
    } else {
      // Custom user ID tab selected
      customUserIdControl?.setValidators([Validators.required, Validators.minLength(8)]);
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
    customUserIdControl?.updateValueAndValidity();
  }

  private getCurrentUserId(): string {
    if (this.selectedTab === 0) {
      return this.chantForm.get('phoneNumber')?.value || '';
    } else {
      return this.chantForm.get('customUserId')?.value || '';
    }
  }

  submitChant(): void {
    if (this.chantForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const userId = this.getCurrentUserId();
    const count = this.chantForm.get('count')?.value;
    const selectedDate = this.chantForm.get('date')?.value;
    
    // Use selected date or current date
    const date = selectedDate ? this.formatDate(selectedDate) : this.formatDate(new Date());

    const request = {
      userid: userId,
      date: date,
      count: parseInt(count, 10)
    };

    // First, try to add the chant
    this.apiService.addChant(request).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.showMessage('Chant count added successfully!', 'success');
          this.loadUserStats(userId);
          this.loadTotalStats();
          // Reset only the count field, keep user ID
          this.chantForm.patchValue({ count: '', date: '' });
          this.isLoading = false;
        } else {
          // If user doesn't exist, try to create user first
          if (response.message.toLowerCase().includes('user') && response.message.toLowerCase().includes('not')) {
            this.createUserAndAddChant(userId, request);
          } else {
            this.showMessage(response.message, 'error');
            this.isLoading = false;
          }
        }
      },
      error: (error) => {
        console.error('Error adding chant:', error);
        // Try to create user if it's a user not found error
        this.createUserAndAddChant(userId, request);
      }
    });
  }

  private createUserAndAddChant(userId: string, chantRequest: any): void {
    const createUserRequest = { userid: userId };
    
    this.apiService.createUser(createUserRequest).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          // User created successfully, now add the chant
          this.apiService.addChant(chantRequest).subscribe({
            next: (chantResponse: ApiResponse) => {
              if (chantResponse.success) {
                this.showMessage('User created and chant count added successfully!', 'success');
                this.loadUserStats(userId);
                this.loadTotalStats();
                this.chantForm.patchValue({ count: '', date: '' });
              } else {
                this.showMessage(chantResponse.message, 'error');
              }
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error adding chant after user creation:', error);
              this.showMessage('Error adding chant count. Please try again.', 'error');
              this.isLoading = false;
            }
          });
        } else {
          this.showMessage(response.message, 'error');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.showMessage('Error creating user. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }

  private loadUserStats(userId: string): void {
    this.apiService.getUserTotal(userId).subscribe({
      next: (stats: UserTotalResponse) => {
        this.userStats = stats;
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
      }
    });
  }

  private loadTotalStats(): void {
    this.apiService.getTotalChants().subscribe({
      next: (stats: TotalChantsResponse) => {
        this.totalStats = stats;
      },
      error: (error) => {
        console.error('Error loading total stats:', error);
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.chantForm.controls).forEach(key => {
      const control = this.chantForm.get(key);
      control?.markAsTouched();
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}
