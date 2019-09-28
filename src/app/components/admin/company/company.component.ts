import {Component, OnInit} from '@angular/core';
import {IUser} from '../../../models/user';
import {Observable} from 'rxjs';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap, tap} from 'rxjs/operators';
import {AdminService} from '../../../services/admin.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogService} from '../../../services/dialog.service';
import {SnackbarService} from '../../../snackbars/snackbar.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  public companyData: Observable<IUser>;
  public companyForm: FormGroup;
  private userId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private as: AdminService,
    private formBuilder: FormBuilder,
    private ds: DialogService,
    private snack: SnackbarService
  ) {
  }

  get f(): any {
    return this.companyForm.controls;
  }

  public onSubmit(): void {
    if (!this.companyForm.invalid) {
      this.as.editUser(this.companyForm.value as IUser, this.userId).subscribe((user: IUser) => {
        this.snack.success('Zmiany zostały zapisane');
      });
    }
  }

  changePassword() {
    this.ds.openChangePasswordDialog().subscribe(result => {
      if (result) {
        this.as.changeUserPassword(result, this.userId).subscribe(() => {
          this.snack.success('Hasło zostało zmienione');
        });
      }
    });
  }

  deleteUser() {
    this.ds.openConfirmDialog('Czy na pewno chcesz usunąć tego użytkownika?').subscribe(result => {
      if (result) {
        this.as.deleteUser(this.userId).subscribe(() => {
          this.snack.success('Użytkownik został usunięty');
          this.router.navigate(['../'], {relativeTo: this.route});
        });
      }
    });
  }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.companyData = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
          this.userId = parseInt(params.get('id'), 10);
          return this.as.getUser(this.userId).pipe(
            tap((user: IUser) => this.companyForm.patchValue(user)));
        }
      )
    );
  }


}
