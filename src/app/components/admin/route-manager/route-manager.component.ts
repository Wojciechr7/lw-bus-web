import {Component, OnInit} from '@angular/core';
import {TableFieldModel} from '../../../modules/table-builder/table/table.component';
import {AdminService} from '../../../services/admin.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogService} from '../../../services/dialog.service';
import {SnackbarService} from '../../../snackbars/snackbar.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-route-manager',
  templateUrl: './route-manager.component.html',
  styleUrls: ['./route-manager.component.scss']
})
export class RouteManagerComponent implements OnInit {

  routes;
  tableFields: TableFieldModel[];
  public form: FormGroup;
  filteredOptions: Observable<any>;
  filteredOptionsEnd: Observable<any>;
  stops;

  constructor(
    private as: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    private ds: DialogService,
    private snack: SnackbarService
  ) {
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

  get f(): any {
    return this.form.controls;
  }

  rowClick(data) {
    this.redirect('/admin/routes/' + data.id);
  }

  public redirect(loc: string) {
    this.router.navigate([loc]);
  }

  noCustom() {
    return (formGroup: FormGroup) => {
      const matchingControlStart = formGroup.controls['StartLocFormControl'];
      const matchingControlEnd = formGroup.controls['EndLocFormControl'];
      if (matchingControlStart.errors && !matchingControlStart.errors.noCustom) {
        return;
      }
      if (matchingControlEnd.errors && !matchingControlEnd.errors.noCustom) {
        return;
      }
      if (!this.f.StartLocFormControl.value.hasOwnProperty('id')) {
        matchingControlStart.setErrors({ noCustom: true });
      } else {
        matchingControlStart.setErrors(null);
      }
      if (!this.f.EndLocFormControl.value.hasOwnProperty('id')) {
        matchingControlEnd.setErrors({ noCustom: true });
      } else {
        matchingControlEnd.setErrors(null);
      }
    };
  }


  onSubmit() {
    const route = {
      from: this.f.StartLocFormControl.value.id,
      to: this.f.EndLocFormControl.value.id,
      stopIds: [this.f.StartLocFormControl.value.id, this.f.EndLocFormControl.value.id]
    };

    if (this.form.valid && !isNaN(route.from) && !isNaN(route.to)) {
      this.as.postRoute(route).subscribe(data => {
        this.redirect('/admin/routes/' + data.id);
        this.snack.success('Zapisano nową trasę');
      });
    } else {
      this.snack.error('Błąd walidacji');
    }
  }

  displayFn(user) {
    return user ? user.name : undefined;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      StartLocFormControl: new FormControl('', [Validators.required]),
      EndLocFormControl: new FormControl('', [Validators.required]),
    },
      {
        validator: this.noCustom()
      });
    this.as.getRoutes().subscribe(data => {
      this.as.getCities().subscribe(stop => {
        this.routes = data.map(r => {
          r.from = r.from.name;
          r.to = r.to.name;
          return r;
        });
        this.stops = stop;
        this.filteredOptions = this.f.StartLocFormControl.valueChanges
          .pipe(
            startWith(''),
            // @ts-ignore
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.stops.slice())
          );
        this.filteredOptionsEnd = this.f.EndLocFormControl.valueChanges
          .pipe(
            startWith(''),
            // @ts-ignore
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.stops.slice())
          );
      });
    });

  }

  private _filter(name) {
    const filterValue = name.toLowerCase();
    return this.stops.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
