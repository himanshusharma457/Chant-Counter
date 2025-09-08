import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApiService, ApiResponse, UserTotalResponse, TotalChantsResponse } from '../../services/api.service';

@Component({
  selector: 'app-add-chant',
  templateUrl: './add-chant.component.html',
  styleUrls: ['./add-chant.component.css'],
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
export class AddChantComponent implements OnInit {
  chantForm: FormGroup;
  mode: 'phone' | 'username' = 'phone';
  userType: 'existing' | 'new' | null = null;
  isLoading = false;
  isVerifying = false;
  userStats: UserTotalResponse | null = null;
  totalStats: TotalChantsResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.chantForm = this.fb.group({
      phoneNumber: ['', []],
      customUserId: ['', []],
      count: ['', [Validators.required, Validators.min(1)]],
      date: ['', [this.futureDateValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    // Get mode and userType from query parameters
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'phone';
      this.userType = params['userType'] || null;
      
      // If username is provided in query params (from create-username component or existing user)
      if (params['username']) {
        this.chantForm.patchValue({ customUserId: params['username'] });
      }
      
      this.updateValidators();
    });
    
    this.loadTotalStats();
    this.setupFormChangeListeners();
  }

  private setupFormChangeListeners(): void {
    // Listen for changes in phone number input
    this.chantForm.get('phoneNumber')?.valueChanges.subscribe((value) => {
      if (this.mode === 'phone') {
        // Reset user stats when phone number changes
        this.userStats = null;
        this.isVerifying = false;
      }
    });

    // Listen for changes in username input
    this.chantForm.get('customUserId')?.valueChanges.subscribe((value) => {
      if (this.mode === 'username') {
        // Reset user stats when username changes
        this.userStats = null;
        this.isVerifying = false;
      }
    });
  }

  // Custom validator to prevent future dates
  futureDateValidator(control: any) {
    if (!control.value) {
      return null;
    }
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return { futureDate: true };
    }
    
    return null;
  }

  getMaxDate(): Date {
    return new Date();
  }

  private updateValidators(): void {
    const phoneControl = this.chantForm.get('phoneNumber');
    const customUserIdControl = this.chantForm.get('customUserId');

    if (this.mode === 'phone') {
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
      customUserIdControl?.clearValidators();
    } else {
      customUserIdControl?.setValidators([Validators.required, Validators.minLength(8)]);
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
    customUserIdControl?.updateValueAndValidity();
  }

  getIdentificationIcon(): string {
    return this.mode === 'phone' ? 'phone' : 'account_circle';
  }

  getIdentificationTitle(): string {
    if (this.mode === 'phone') {
      return 'Phone Number';
    }
    return this.userType === 'existing' ? 'Username' : 'Create Username';
  }

  getIdentificationDescription(): string {
    if (this.mode === 'phone') {
      return 'Enter your phone number to track your chants';
    }
    return this.userType === 'existing' 
      ? 'Enter your existing username to continue tracking'
      : 'Create a unique username for your spiritual journey';
  }

  getUsernameLabel(): string {
    return this.userType === 'existing' ? 'Your Username' : 'Create Username';
  }

  getUsernamePlaceholder(): string {
    return this.userType === 'existing' 
      ? 'Enter your existing username'
      : 'Create your unique user ID';
  }

  getUsernameHint(): string {
    return this.userType === 'existing'
      ? 'Enter the username you previously created'
      : 'Minimum 8 characters, letters and numbers allowed';
  }

  checkUsernameStats(): void {
    const username = this.chantForm.get('customUserId')?.value;
    if (!username) return;

    this.isVerifying = true;
    this.loadUserStats(username);
  }

  verifyPhoneNumber(): void {
    const phoneNumber = this.chantForm.get('phoneNumber')?.value;
    if (!phoneNumber || phoneNumber.length !== 10) return;

    this.isVerifying = true;
    this.loadUserStats(phoneNumber);
  }

  private getCurrentUserId(): string {
    if (this.mode === 'phone') {
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
    
    const date = selectedDate ? this.formatDate(selectedDate) : this.formatDate(new Date());

    const request = {
      userid: userId,
      date: date,
      count: parseInt(count, 10)
    };

    // For new username users, create user first
    if (this.mode === 'username' && this.userType === 'new') {
      this.createUserAndAddChant(userId, request);
    } else {
      // For existing users (phone or verified username), try to add chant directly
      this.addChant(userId, request);
    }
  }

  private addChant(userId: string, request: any): void {
    this.apiService.addChant(request).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.showMessage('Chant count added successfully!', 'success');
          this.loadUserStats(userId);
          this.loadTotalStats();
          this.chantForm.patchValue({ count: '', date: '' });
          this.isLoading = false;
        } else {
          // Check if it's a user not found error specifically for username users
          if (response.message.toLowerCase().includes('user does not exist') || 
              response.message.toLowerCase().includes('user not found') ||
              (response.message.toLowerCase().includes('user') && response.message.toLowerCase().includes('not'))) {
            if (this.mode === 'username' && this.userType === 'existing') {
              // For existing username users, don't auto-create, show error
              this.showMessage('Username not found. Please verify your username or create a new account.', 'error');
              this.isLoading = false;
            } else {
              // For phone numbers or new username users, try to create user
              this.createUserAndAddChant(userId, request);
            }
          } else {
            this.showMessage(response.message, 'error');
            this.isLoading = false;
          }
        }
      },
      error: (error) => {
        console.error('Error adding chant:', error);
        // Only auto-create for phone numbers or new username users
        if (this.mode === 'phone' || (this.mode === 'username' && this.userType === 'new')) {
          this.createUserAndAddChant(userId, request);
        } else {
          this.showMessage('Error adding chant. Please check your username and try again.', 'error');
          this.isLoading = false;
        }
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
                const successMessage = this.mode === 'username' 
                  ? 'Username created and chant count added successfully!' 
                  : 'User created and chant count added successfully!';
                this.showMessage(successMessage, 'success');
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
          // Handle specific error messages
          if (response.message.toLowerCase().includes('already exists') || 
              response.message.toLowerCase().includes('user exists')) {
            // Username already exists - show error message
            this.showMessage('This username already exists. Please choose a different username.', 'error');
            this.isLoading = false;
          } else {
            this.showMessage(response.message, 'error');
            this.isLoading = false;
          }
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
    // For username mode, first check if user exists
    if (this.mode === 'username') {
      this.apiService.isUserExists(userId).subscribe({
        next: (exists: boolean) => {
          if (exists) {
            // User exists, load their stats
            this.getUserTotalStats(userId);
          } else {
            // User doesn't exist
            this.isVerifying = false;
            this.userStats = null;
            this.showMessage('Username not found. Please verify your username or create a new account.', 'error');
          }
        },
        error: (error) => {
          console.error('Error checking user existence:', error);
          this.isVerifying = false;
          this.userStats = null;
          this.showMessage('Error checking username. Please try again.', 'error');
        }
      });
    } else {
      // For phone numbers, directly load stats (handles auto-creation)
      this.getUserTotalStats(userId);
    }
  }

  private getUserTotalStats(userId: string): void {
    this.apiService.getUserTotal(userId).subscribe({
      next: (stats: UserTotalResponse) => {
        this.userStats = stats;
        this.isVerifying = false;
        
        // Show appropriate success message based on mode
        if (this.mode === 'phone') {
          this.showMessage(`Phone number verified! Your total count: ${stats.totalCount}`, 'success');
        } else {
          this.showMessage(`Total count loaded! Your total count: ${stats.totalCount}`, 'success');
        }
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
        this.isVerifying = false;
        
        // Show appropriate error message based on mode
        if (this.mode === 'phone') {
          this.showMessage('Phone number not found in our records. You can still add your first chant count.', 'error');
          this.userStats = null;
        } else {
          this.showMessage('Username not found. Please check and try again.', 'error');
          this.userStats = null;
        }
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

  goBack(): void {
    if (this.mode === 'phone') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/user-type']);
    }
  }
}
