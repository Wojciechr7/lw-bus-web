import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-input-dialog',
  templateUrl: 'add-input.dialog.html',
  styleUrls: ['add-input.dialog.scss']
})
export class AddInputDialogComponent {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<AddInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  closeDialog(data): void {
    const foundElement = this.data.addFields.find(field => field.name === data);
    if (foundElement) {
      this.dialogRef.close(foundElement);
    } else {
      this.dialogRef.close({name: data});
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.addFields.filter(option => option.name.toLowerCase().includes(filterValue));
  }


}
