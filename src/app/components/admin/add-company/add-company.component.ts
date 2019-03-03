import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../../services/admin.service';
import {IUser} from '../../../models/user';
import {DialogService} from '../../../services/dialog.service';

@Component({
    selector: 'app-add-company',
    templateUrl: './add-company.component.html',
    styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

    public registerForm: FormGroup;
    public hide: boolean;
    public loading: boolean;

    constructor(private as: AdminService, private formBuilder: FormBuilder, private ds: DialogService) {
        this.hide = true;
        this.loading = false;

    }

    get f(): any {
        return this.registerForm.controls;
    }


    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            login: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            pass: ['', Validators.required]
        });


    }

    public onSubmit(): void {

        if (!this.registerForm.invalid) {
            this.loading = true;
            this.as.createUser(this.registerForm.value as IUser).subscribe((response: number) => {
                this.loading = false;
                this.ds.openInfoDialog('User created!', `/admin/companies/${response}`);
            });
        }

    }


}
