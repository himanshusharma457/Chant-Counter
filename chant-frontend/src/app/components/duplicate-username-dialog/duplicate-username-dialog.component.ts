import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-duplicate-username-dialog',
  templateUrl: './duplicate-username-dialog.component.html',
  styleUrls: ['./duplicate-username-dialog.component.css']
})
export class DuplicateUsernameDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DuplicateUsernameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { username: string }
  ) {}

  onContinue(): void {
    this.dialogRef.close('continue');
  }

  onCreateNew(): void {
    this.dialogRef.close('create-new');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
