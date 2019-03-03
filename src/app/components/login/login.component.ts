import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import {ILoginData} from '../../models/login';

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


    constructor(public ls: LoginService, private router: Router, private authenticationService: AuthenticationService) {
        this.ls.loading = false;
        this.hide = true;



    }

    public login(...loginParams: Array<string>): void {
        const userData = {
            login: loginParams[0],
            pass: loginParams[1]
        };
        this.ls.loading = true;

        this.authenticationService.login(userData as ILoginData)
            .pipe(first())
            .subscribe(
                data => {
                    // console.log('done');
                    this.router.navigate(['/admin/companies']);
                },
                error => {
                    // alert(error);
                    // console.log(error);
                    this.ls.loading = false;
                });

    }

    ngOnInit() {
    }

}
