import {Component, OnInit} from '@angular/core';
import {IUser} from '../../../models/user';
import {Observable} from 'rxjs';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap, tap} from 'rxjs/operators';
import {AdminService} from '../../../services/admin.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogService} from '../../../services/dialog.service';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

    public companyData: Observable<IUser>;
    public companyForm: FormGroup;
    public editing: boolean;
    private userId: number;

    constructor(private route: ActivatedRoute, private router: Router, private as: AdminService, private formBuilder: FormBuilder, private ds: DialogService) {
        this.editing = false;
    }

    public onSubmit(): void {
        if (!this.companyForm.invalid) {
            this.editing = true;
            this.as.editUser(this.companyForm.value as IUser, this.userId).subscribe((user: IUser) => {
                this.editing = false;
                this.ds.openInfoDialog('Przewoźnik został zedytowany!');
            });
        }
    }

    get f(): any {
        return this.companyForm.controls;
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
