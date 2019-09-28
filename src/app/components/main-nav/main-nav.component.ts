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
                    {icon: 'search', name: 'Szukaj Połączenia', route: ''},
                    {icon: 'directions_bus', name: 'Obsługiwanie Busy', route: ''},
                    {icon: 'phone', name: 'Kontakt', route: ''},
                    {icon: 'business_center', name: 'Dla Przewoźników', route: 'for-company'}
                ]
            },
            admin: {
                title: 'Panel Administracyjny',
                buttons: [
                    {icon: 'input', name: 'Logowanie', route: 'admin/login'},
                    {icon: 'search', name: 'Szukaj Połączenia', route: ''},
                    {icon: 'group_add', name: 'Dodaj Przewoźnika', route: 'admin/add-company'},
                    {icon: 'people', name: 'Zarządzaj Przewoźnikami', route: 'admin/companies'},
                    {icon: 'flag', name: 'Zarządzaj Przystankami', route: 'admin/stops'},
                    {icon: 'timeline', name: 'Zarządzaj Trasami', route: 'admin/routes'}
                ]
            },
          company: {
            title: 'Panel obsługi dla firm przewozowych',
            buttons: [
              {icon: 'input', name: 'Logowanie', route: 'for-company/login'},
              {icon: 'search', name: 'Szukaj Połączenia', route: ''},
              {icon: 'add', name: 'Dodaj połączenie', route: 'for-company/add'},
              {icon: 'list', name: 'Przeglądaj połączenia', route: 'for-company/view'},
              {icon: 'info', name: 'Informacje', route: 'for-company/info'}
            ]
          }
        };
    }

    public redirect(location: string): void {
        this.router.navigate([location]);

    }

}
