import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AdminService} from '../../../services/admin.service';
import {IUser} from '../../../models/user';
import {Router} from '@angular/router';


@Component({
  selector: 'app-company-manager',
  templateUrl: './company-manager.component.html',
  styleUrls: ['./company-manager.component.scss']
})
export class CompanyManagerComponent implements OnInit {

  private users: IUser[];
  public loading: boolean;

  displayedColumns: string[] = ['id', 'name', 'login', 'email'];
  dataSource = new MatTableDataSource(this.users);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private as: AdminService, private router: Router) {
    this.loading = true;
  }

  public redirect(loc: string) {
    this.router.navigate([loc]);

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.as.getUsers().subscribe((data: Array<IUser>) => {
      this.users = [...data];
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

}
