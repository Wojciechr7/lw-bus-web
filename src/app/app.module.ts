import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import {LayoutModule} from '@angular/cdk/layout';
import {
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSidenavModule, MatTableModule, MatTabsModule,
  MatToolbarModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatProgressSpinnerModule, MatSortModule, MatPaginatorModule, MatGridListModule, MatMenuModule, MatTreeModule
} from '@angular/material';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MainNavComponent} from './components/main-nav/main-nav.component';
import {LoginComponent} from './components/login/login.component';
import { CompanyManagerComponent } from './components/admin/company-manager/company-manager.component';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {ErrorInterceptor} from './helpers/error.interceptor';
import {InfoDialogComponent} from './dialogs/info/info.dialog';
import { AddCompanyComponent } from './components/admin/add-company/add-company.component';
import { FormularzeComponent } from './components/admin/formularze/formularze.component';
import { CompanyComponent } from './components/admin/company/company.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StopsComponent } from './components/admin/stops/stops.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    MainNavComponent,
    LoginComponent,
    CompanyManagerComponent,
      InfoDialogComponent,
      AddCompanyComponent,
      FormularzeComponent,
      CompanyComponent,
      StopsComponent
  ],
  imports: [
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
    MatTableModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSortModule,
      MatPaginatorModule,
      MatGridListModule,
      MatMenuModule,
      MatTreeModule,
      DragDropModule
  ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
  bootstrap: [AppComponent],
  entryComponents: [InfoDialogComponent]
})
export class AppModule { }
