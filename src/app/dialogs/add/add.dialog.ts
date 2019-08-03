import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-add-dialog',
    templateUrl: 'add.dialog.html',
    styleUrls: ['add.dialog.scss']
})
export class AddDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    closeDialog(data): void {
        this.dialogRef.close(data);
    }


}
