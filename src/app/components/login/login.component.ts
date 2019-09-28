import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {first} from 'rxjs/operators';
import {ILoginData} from '../../models/login';
import {SnackbarService} from '../../snackbars/snackbar.service';
import {AppService} from '../../services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public passwordFormControl = new FormControl('', [
    Validators.required
  ]);
  public loginFormControl = new FormControl('', [
    Validators.required
  ]);
  public hide: boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private snack: SnackbarService,
    private as: AppService
  ) {
    this.hide = true;
  }

  public login(...loginParams: Array<string>): void {
    const userData = {
      login: loginParams[0],
      pass: loginParams[1]
    };

    this.authenticationService.login(userData as ILoginData)
      .pipe(first())
      .subscribe(
        data => {
          this.snack.success('Pomyślne logowanie');
          if (this.as.AppMode === 'admin') {
            this.router.navigate(['/admin/companies']);
          } else if (this.as.AppMode === 'company') {
            this.router.navigate(['/for-company/view']);
          }

        },
        error => {
        });
  }

  ngOnInit() {
  }

}
