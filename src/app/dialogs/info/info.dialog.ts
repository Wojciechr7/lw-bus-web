import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
    info: string;
}

@Component({
    selector: 'app-info-dialog',
    templateUrl: 'info.dialog.html',
})
export class InfoDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<InfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    closeDialog(): void {
        this.dialogRef.close();
    }


}
