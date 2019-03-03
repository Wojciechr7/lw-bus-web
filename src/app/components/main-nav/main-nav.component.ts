import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router';
import {AppService} from '../../services/app.service';

@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

    public navbarSetup;

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );


    constructor(private breakpointObserver: BreakpointObserver, private router: Router, public as: AppService) {
        this.navbarSetup = {
            standard: {
                title: 'LW BUS',
                buttons: [
                    {name: 'Szukaj Połączenia', route: ''},
                    {name: 'Obsługiwanie Busy', route: ''},
                    {name: 'Kontakt', route: ''},
                    {name: 'Dla Przewoźników', route: ''}
                ]
            },
            admin: {
                title: 'Panel Administracyjny',
                buttons: [
                    {name: 'Logowanie', route: 'admin/login'},
                    {name: 'Dodaj Przewoźnika', route: 'admin/add-company'},
                    {name: 'Zarządzaj Przewoźnikami', route: 'admin/companies'},
                    {name: 'Zarządzaj Przystankami', route: 'admin/stops'}

                ]
            }
        };
    }

    public redirect(location: string): void {
        this.router.navigate([location]);

    }

}
