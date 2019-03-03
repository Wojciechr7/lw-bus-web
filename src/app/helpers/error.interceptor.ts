import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import {DialogService} from '../services/dialog.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private ds: DialogService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // console.log(err);
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                this.ds.openInfoDialog('Problem z autoryzacją użytkownika!', '/admin/login');
            }
            if (err.status === 403) {
                this.authenticationService.logout();
                this.ds.openInfoDialog('Brak uprawnień do wykonania tej operacji!', '/admin/login');
            }
            if (err.status === 409) {
                this.ds.openInfoDialog('Wyprowadź unikalne dane w formularzu!');
            }
            if (err.status === 500) {
                this.ds.openInfoDialog('Błąd Serwera!');
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

}
