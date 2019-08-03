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
import {SingleRouteComponent} from './components/admin/route-manager/single-route/single-route.component';

const routes: Routes = [
  /*{ path: '',
    redirectTo: '/admin/stops',
    pathMatch: 'full'
  },*/
  {path: '', component: HomeComponent},
  {path: 'admin', component: AdminComponent, children: [
      {path: '', redirectTo: 'companies', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'companies', component: CompanyManagerComponent, canActivate: [AuthGuard]},
      {path: 'add-company', component: AddCompanyComponent, canActivate: [AuthGuard]},
      {path: 'companies/:id', component: CompanyComponent, canActivate: [AuthGuard]},
      {path: 'stops', component: StopsComponent, canActivate: [AuthGuard]},
      {path: 'routes', component: RouteManagerComponent, canActivate: [AuthGuard]},
      {path: 'routes/:id', component: SingleRouteComponent, canActivate: [AuthGuard]}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
