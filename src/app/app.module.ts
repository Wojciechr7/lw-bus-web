import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AdminComponent} from './components/admin/admin.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './components/home/home.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MainNavComponent} from './components/main-nav/main-nav.component';
import {LoginComponent} from './components/login/login.component';
import {CompanyManagerComponent} from './components/admin/company-manager/company-manager.component';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {ErrorInterceptor} from './helpers/error.interceptor';
import {InfoDialogComponent} from './dialogs/info/info.dialog';
import {AddCompanyComponent} from './components/admin/add-company/add-company.component';
import {CompanyComponent} from './components/admin/company/company.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {StopsComponent} from './components/admin/stops/stops.component';
import {RouteManagerComponent} from './components/admin/route-manager/route-manager.component';
import {TableBuilderModule} from './modules/table-builder/table-builder.module';
import {SingleRouteComponent} from './components/admin/route-manager/single-route/single-route.component';
import {AddDialogComponent} from './dialogs/add/add.dialog';
import {ConfirmDialogComponent} from './dialogs/confirm/confirm.dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {SuccessSnackbarComponent} from './snackbars/success-snackbar/success-snackbar.component';
import {ErrorSnackbarComponent} from './snackbars/error-snackbar/error-snackbar.component';
import {WarningSnackbarComponent} from './snackbars/warning-snackbar/warning-snackbar.component';
import {InfoSnackbarComponent} from './snackbars/info-snackbar/info-snackbar.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ForCompanyComponent} from './components/for-company/for-company.component';
import {AddRouteComponent} from './components/for-company/add-route/add-route.component';
import {ViewRoutesComponent} from './components/for-company/view-routes/view-routes.component';
import {InfoComponent} from './components/for-company/info/info.component';
import {LoaderComponent} from './helpers/loader/component/loader.component';
import {LoaderInterceptor} from './helpers/loader/loader.interceptor';
import {FindDialogComponent} from './dialogs/find/find.dialog';
import {AddInputDialogComponent} from './dialogs/add-input/add-input.dialog';
import {MatCheckboxModule, MatChipsModule} from '@angular/material';
import localePl from '@angular/common/locales/pl';
import {registerLocaleData} from '@angular/common';
import {SingleRouteUserComponent} from './components/for-company/single-route/single-route.component';
import { FindRoutesComponent } from './components/home/find-routes/find-routes.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {ChangePasswordDialogComponent} from './dialogs/change-password/change-password.dialog';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BusesComponent } from './components/home/buses/buses.component';
import { ContactComponent } from './components/home/contact/contact.component';

registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    MainNavComponent,
    LoginComponent,
    CompanyManagerComponent,
    InfoDialogComponent,
    AddDialogComponent,
    ConfirmDialogComponent,
    AddCompanyComponent,
    CompanyComponent,
    StopsComponent,
    RouteManagerComponent,
    SuccessSnackbarComponent,
    ErrorSnackbarComponent,
    WarningSnackbarComponent,
    InfoSnackbarComponent,
    ForCompanyComponent,
    AddRouteComponent,
    ViewRoutesComponent,
    InfoComponent,
    LoaderComponent,
    FindDialogComponent,
    AddInputDialogComponent,
    SingleRouteComponent,
    SingleRouteUserComponent,
    FindRoutesComponent,
    ChangePasswordDialogComponent,
    BusesComponent,
    ContactComponent
  ],
  imports: [
    TableBuilderModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatGridListModule,
    MatMenuModule,
    MatTreeModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule,
    MatExpansionModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'pl'},
    {provide: MAT_DATE_LOCALE, useValue: 'pl'},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    InfoDialogComponent,
    AddDialogComponent,
    ConfirmDialogComponent,
    SuccessSnackbarComponent,
    InfoSnackbarComponent,
    ErrorSnackbarComponent,
    WarningSnackbarComponent,
    FindDialogComponent,
    AddInputDialogComponent,
    ChangePasswordDialogComponent
  ]
})
export class AppModule {
}
