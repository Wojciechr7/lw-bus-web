import {Injectable} from '@angular/core';
import {InfoDialogComponent} from '../dialogs/info/info.dialog';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AddDialogComponent} from '../dialogs/add/add.dialog';
import {ConfirmDialogComponent} from '../dialogs/confirm/confirm.dialog';
import {FindDialogComponent} from '../dialogs/find/find.dialog';
import {AddInputDialogComponent} from '../dialogs/add-input/add-input.dialog';
import {ChangePasswordDialogComponent} from '../dialogs/change-password/change-password.dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog, private router: Router) {
  }

  public openInfoDialog(info: string, location?: string): void {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      data: {info: info}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (location) {
        this.router.navigate([location]);
      }
    });
  }

  public openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);
    return dialogRef.afterClosed();
  }

  public openAddDialog(addFields, currentFields, label): void {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '500px',
      data: {addFields, label}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.forEach(id => {
          currentFields.push(addFields.find(f => f.id === id));
        });
      }
    });
  }

  public openAddInputDialog(addFields, currentFields, label): void {
    const dialogRef = this.dialog.open(AddInputDialogComponent, {
      width: '500px',
      data: {addFields, label}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name) {
        if (!currentFields.some(option => option.name.toLowerCase().includes(result.name.toLowerCase()))) {
          if (result.id) {
            currentFields.push({name: result.name, id: result.id, stop_id: result.id});
          } else {
            currentFields.push({name: result.name});
          }
        }
      }
    });
  }

  public openFindDialog(tableFields, display, label) {
    const dialogRef = this.dialog.open(FindDialogComponent, {
      width: '500px',
      data: {tableFields, display, label}
    });
    return dialogRef.afterClosed();
  }

  public openConfirmDialog(message) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {message}
    });
    return dialogRef.afterClosed();
  }
}
