import {Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-change-password-dialog',
    templateUrl: 'change-password.dialog.html',
    styleUrls: ['change-password.dialog.scss']
})
export class ChangePasswordDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    closeDialog(data): void {
        this.dialogRef.close(data);
    }


}
