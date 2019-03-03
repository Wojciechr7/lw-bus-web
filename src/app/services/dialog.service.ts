import { Injectable } from '@angular/core';
import {InfoDialogComponent} from '../dialogs/info/info.dialog';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';

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
}
