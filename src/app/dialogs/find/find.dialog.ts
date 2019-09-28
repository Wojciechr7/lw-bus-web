import {Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {TableFieldModel} from '../../modules/table-builder/table/table.component';

interface FindDialogData {
  tableFields: TableFieldModel[];
  display: any;
}

@Component({
    selector: 'app-add-dialog',
    templateUrl: 'find.dialog.html',
    styleUrls: ['find.dialog.scss']
})
export class FindDialogComponent {
  selected;

    constructor(
        public dialogRef: MatDialogRef<FindDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    closeDialog(decision) {
      if (!(decision && !this.selected)) {
        this.dialogRef.close({decision, selected: this.selected});
      }
    }

  rowClick(data) {
      this.selected = data;
  }


}
