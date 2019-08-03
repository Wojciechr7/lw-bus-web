import { Injectable } from '@angular/core';
import {InfoDialogComponent} from '../dialogs/info/info.dialog';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {AddDialogComponent} from '../dialogs/add/add.dialog';
import {ConfirmDialogComponent} from '../dialogs/confirm/confirm.dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog, private router: Router) { }


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

  public openConfirmDialog(message) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {message}
    });
    return dialogRef.afterClosed();
  }
}
