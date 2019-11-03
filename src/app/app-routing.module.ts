import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './components/admin/admin.component';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {CompanyManagerComponent} from './components/admin/company-manager/company-manager.component';
import {AuthGuard} from './guards/auth.guard';
import {AddCompanyComponent} from './components/admin/add-company/add-company.component';
import {CompanyComponent} from './components/admin/company/company.component';
import {StopsComponent} from './components/admin/stops/stops.component';
import {RouteManagerComponent} from './components/admin/route-manager/route-manager.component';
import {ForCompanyComponent} from './components/for-company/for-company.component';
import {AddRouteComponent} from './components/for-company/add-route/add-route.component';
import {ViewRoutesComponent} from './components/for-company/view-routes/view-routes.component';
import {InfoComponent} from './components/for-company/info/info.component';
import {SingleRouteComponent} from './components/admin/route-manager/single-route/single-route.component';
import {SingleRouteUserComponent} from './components/for-company/single-route/single-route.component';
import {FindRoutesComponent} from './components/home/find-routes/find-routes.component';
import {BusesComponent} from './components/home/buses/buses.component';
import {ContactComponent} from './components/home/contact/contact.component';

const routes: Routes = [
  {path: '', component: HomeComponent, children: [
      {path: '', redirectTo: 'find-routes', pathMatch: 'full'},
      {path: 'find-routes', component: FindRoutesComponent},
      {path: 'buses', component: BusesComponent},
      {path: 'contact', component: ContactComponent}
    ]},
  {path: 'admin', component: AdminComponent, data: { role: 'admin'}, children: [
      {path: '', redirectTo: 'companies', pathMatch: 'full', canActivate: [AuthGuard], data: { role: 'admin'}},
      {path: 'login', component: LoginComponent, data: { role: 'admin'}},
      {path: 'companies', component: CompanyManagerComponent, canActivate: [AuthGuard], data: { role: 'admin'}},
      {path: 'add-company', component: AddCompanyComponent, canActivate: [AuthGuard], data: { role: 'admin'}},
      {path: 'companies/:id', component: CompanyComponent, canActivate: [AuthGuard], data: { role: 'admin'}},
      {path: 'stops', component: StopsComponent, data: { role: 'admin'}},
      {path: 'routes', component: RouteManagerComponent, canActivate: [AuthGuard], data: { role: 'admin'}},
      {path: 'routes/:id', component: SingleRouteComponent, canActivate: [AuthGuard], data: { role: 'admin'}}
    ]},
  {path: 'for-company', component: ForCompanyComponent, data: { role: 'user' }, children: [
      {path: '', redirectTo: 'view', pathMatch: 'full', canActivate: [AuthGuard], data: { role: 'user' }},
      {path: 'login', component: LoginComponent, data: { role: 'user' }},
      {path: 'add', component: AddRouteComponent, canActivate: [AuthGuard], data: { role: 'user' }},
      {path: 'view', component: ViewRoutesComponent, canActivate: [AuthGuard], data: { role: 'user' }},
      {path: 'view/:id', component: SingleRouteUserComponent, canActivate: [AuthGuard], data: { role: 'user' }},
      {path: 'info', component: InfoComponent, canActivate: [AuthGuard], data: { role: 'user' }}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
