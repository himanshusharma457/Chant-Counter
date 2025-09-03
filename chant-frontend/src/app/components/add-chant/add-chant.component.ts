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
  existingUsername: string | null = null;

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
      this.updateValidators();
    });
    
    this.loadTotalStats();
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
      return 'Phone Number Identification';
    }
    return this.userType === 'existing' ? 'Enter Your Username' : 'Create Your Username';
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

  verifyExistingUser(): void {
    const username = this.chantForm.get('customUserId')?.value;
    if (!username) return;

    this.isVerifying = true;
    this.loadUserStats(username);
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

    // For existing username users, check if username is verified
    if (this.mode === 'username' && this.userType === 'existing' && !this.userStats) {
      this.showMessage('Please verify your username first before adding chant count.', 'error');
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
                const successMessage = this.mode === 'username' && this.userType === 'new' 
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
            // Username already exists - show specific error and redirect option
            this.handleExistingUsernameError(userId, chantRequest);
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

  private handleExistingUsernameError(userId: string, chantRequest: any): void {
    this.isLoading = false;
    
    // Show a dialog or snackbar with options
    const snackBarRef = this.snackBar.open(
      `Username '${userId}' already exists. Would you like to add chant count as an existing user?`,
      'Yes, Continue',
      {
        duration: 10000, // 10 seconds
        panelClass: 'info-snackbar'
      }
    );

    snackBarRef.onAction().subscribe(() => {
      // User clicked "Yes, Continue" - proceed as existing user
      this.proceedAsExistingUser(userId, chantRequest);
    });

    snackBarRef.afterDismissed().subscribe((info) => {
      if (!info.dismissedByAction) {
        // User didn't click the action button - show alternative message
        this.showAlternativeOptionsMessage();
      }
    });
  }

  private proceedAsExistingUser(userId: string, chantRequest: any): void {
    this.isLoading = true;
    this.userType = 'existing'; // Change the mode to existing user
    
    // Update the form to reflect the change to existing user mode
    this.chantForm.get('customUserId')?.setValue(userId);
    
    // First verify the user exists and load their stats
    this.loadUserStats(userId);
    
    // Then add the chant
    this.apiService.addChant(chantRequest).subscribe({
      next: (chantResponse: ApiResponse) => {
        if (chantResponse.success) {
          this.showMessage('Username verified and chant count added successfully!', 'success');
          this.loadUserStats(userId);
          this.loadTotalStats();
          this.chantForm.patchValue({ count: '', date: '' });
        } else {
          this.showMessage(chantResponse.message, 'error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding chant for existing user:', error);
        this.showMessage('Error adding chant count. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }

  private showAlternativeOptionsMessage(): void {
    const snackBarRef = this.snackBar.open(
      'You can go back and select "Existing User" option to continue with your username.',
      'Go Back',
      {
        duration: 8000,
        panelClass: 'info-snackbar'
      }
    );

    snackBarRef.onAction().subscribe(() => {
      // Navigate back to user type selection
      this.router.navigate(['/user-type']);
    });
  }

  private loadUserStats(userId: string): void {
    this.apiService.getUserTotal(userId).subscribe({
      next: (stats: UserTotalResponse) => {
        this.userStats = stats;
        this.existingUsername = userId;
        this.isVerifying = false;
        if (this.userType === 'existing') {
          this.showMessage('Username verified successfully!', 'success');
        }
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
        this.isVerifying = false;
        if (this.userType === 'existing') {
          this.showMessage('Username not found. Please check and try again.', 'error');
          this.userStats = null;
          this.existingUsername = null;
        }
        // For phone numbers or successful operations, don't show error for getUserTotal failures
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
