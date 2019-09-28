import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthenticationService} from '../services/authentication.service';
import {DialogService} from '../services/dialog.service';
import {SnackbarService} from '../snackbars/snackbar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../services/app.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private ds: DialogService,
    private snack: SnackbarService,
    private router: Router,
    private as: AppService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.authenticationService.logout();
        this.snack.error('Problem z autoryzacją użytkownika!');
        if (this.as.AppMode === 'admin') {
          this.router.navigate(['/admin/login']);
        }
        if (this.as.AppMode === 'company') {
          this.router.navigate(['/for-company/login']);
        }
      }
      if (err.status === 403) {
        this.authenticationService.logout();
        this.snack.error('Brak uprawnień do wykonania tej operacji!');
        if (this.as.AppMode === 'admin') {
          this.router.navigate(['/admin/login']);
        }
        if (this.as.AppMode === 'company') {
          this.router.navigate(['/for-company/login']);
        }
      }
      if (err.status === 409) {
        this.snack.warning('Wyprowadź unikalne dane w formularzu!');
      }
      if (err.status === 500) {
        this.snack.error('Błąd Serwera!');
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }

}
