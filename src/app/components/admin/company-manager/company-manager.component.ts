import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {IUser} from '../../../models/user';
import {Router} from '@angular/router';
import {TableFieldModel} from '../../../modules/table-builder/table/table.component';


@Component({
  selector: 'app-company-manager',
  templateUrl: './company-manager.component.html',
  styleUrls: ['./company-manager.component.scss']
})
export class CompanyManagerComponent implements OnInit {

  public users: IUser[];
  tableFields: TableFieldModel[];

  constructor(private as: AdminService, private router: Router) {
    this.tableFields = [
      {
        column: 'id',
        header: 'Id.'
      },
      {
        column: 'name',
        header: 'Name'
      },
      {
        column: 'login',
        header: 'Login'
      },
      {
        column: 'email',
        header: 'Email'
      }
    ];
  }

  rowClick(data) {
    this.redirect('/admin/companies/' + data.id);
  }

  public redirect(loc: string) {
    this.router.navigate([loc]);
  }

  ngOnInit() {
    this.as.getUsers().subscribe((data: Array<IUser>) => {
      this.users = [...data];
    });
  }

}
