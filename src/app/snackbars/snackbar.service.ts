import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SuccessSnackbarComponent} from './success-snackbar/success-snackbar.component';
import {WarningSnackbarComponent} from './warning-snackbar/warning-snackbar.component';
import {InfoSnackbarComponent} from './info-snackbar/info-snackbar.component';
import {ErrorSnackbarComponent} from './error-snackbar/error-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {

  }

  success(msg) {
    this.snackBar.openFromComponent(SuccessSnackbarComponent, {
      duration: 2000,
      data: msg,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  warning(msg) {
    this.snackBar.openFromComponent(WarningSnackbarComponent, {
      duration: 2000,
      data: msg,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  info(msg) {
    this.snackBar.openFromComponent(InfoSnackbarComponent, {
      duration: 2000,
      data: msg,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  error(msg) {
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      duration: 2000,
      data: msg,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
