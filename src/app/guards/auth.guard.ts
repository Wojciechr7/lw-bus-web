import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {SnackbarService} from '../snackbars/snackbar.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private snack: SnackbarService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      if (route.data.role && !currentUser.roles.map(role => role.name).includes(route.data.role)) {
        this.snack.warning('Brak uprawnień');
        if (route.data.role === 'admin') {
          this.router.navigate(['/admin/login']);
        }
        if (route.data.role === 'user') {
          this.router.navigate(['/for-company/login']);
        }
        return false;
      }
      return true;
    }
    this.snack.warning('Brak uprawnień');
    if (route.data.role === 'admin') {
      this.router.navigate(['/admin/login']);
    }
    if (route.data.role === 'user') {
      this.router.navigate(['/for-company/login']);
    }
    return false;
  }
}
