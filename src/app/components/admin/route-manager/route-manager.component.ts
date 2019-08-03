import { Component, OnInit } from '@angular/core';
import {TableFieldModel} from '../../../modules/table-builder/table/table.component';
import {AdminService} from '../../../services/admin.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-route-manager',
  templateUrl: './route-manager.component.html',
  styleUrls: ['./route-manager.component.scss']
})
export class RouteManagerComponent implements OnInit {

  routes;
  tableFields: TableFieldModel[];

  constructor(private as: AdminService, private router: Router) {
    this.tableFields = [
      {
        column: 'id',
        header: 'Id.'
      },
      {
        column: 'from',
        header: 'Lokalizacja początkowa'
      },
      {
        column: 'to',
        header: 'Lokalizacja końcowa'
      }
    ];
  }

  rowClick(data) {
    this.redirect('/admin/routes/' + data.id);
  }

  public redirect(loc: string) {
    this.router.navigate([loc]);
  }

  ngOnInit() {
    this.as.getRoutes().subscribe(data => {
      this.routes = data;
      console.log(data);
    });
  }

}
