import {Component, DoCheck, KeyValueDiffer, KeyValueDiffers, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../../services/admin.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DialogService} from '../../../../services/dialog.service';
import {SnackbarService} from '../../../../snackbars/snackbar.service';

@Component({
  selector: 'app-single-route',
  templateUrl: './single-route.component.html',
  styleUrls: ['./single-route.component.scss']
})
export class SingleRouteComponent implements OnInit, DoCheck {

  routeId;
  openedRoute;
  allStops;
  public form: FormGroup;
  private openedRouteDiffer: KeyValueDiffer<string, any>;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.openedRoute.stops, event.previousIndex, event.currentIndex);
  }


  constructor(
    private route: ActivatedRoute,
    private as: AdminService,
    private formBuilder: FormBuilder,
    private ds: DialogService,
    private router: Router,
    private snack: SnackbarService,
    private differs: KeyValueDiffers
  ) {
    this.routeId = this.route.snapshot.paramMap.get('id');
  }

  deleteStop(id) {
    this.openedRoute.stops = this.openedRoute.stops.filter(s => s.id !== id);
  }

  reverseStops() {
    this.openedRoute.stops.reverse();
  }

  onSubmit() {
    const route = {
      id: this.openedRoute.id,
      from: this.openedRoute.from.id,
      to: this.openedRoute.to.id,
      stopIds: this.openedRoute.stops.map(s => s.id)
    };
    if (this.form.valid) {
      this.as.editRoute(route, this.routeId).subscribe(res => {
        this.snack.success('Zmiany zostały zapisane');
      });
    }
  }

  get f(): any {
    return this.form.controls;
  }

  addStop() {
    const filteredStops = this.allStops.filter(stop => !this.openedRoute.stops.map(el => el.id).includes(stop.id));
    const tableFields = [
      {
        column: 'name',
        header: 'Nazwa przystanku'
      }
    ];
    this.ds.openFindDialog(tableFields, filteredStops, 'Przystanki').subscribe(stop => {
      if (stop && stop.decision) {
        this.openedRoute.stops.push(stop.selected);
      }
    });
  }

  removeRoute() {
    this.ds.openConfirmDialog(`Czy na pewno chcesz usunąć trasę ${this.openedRoute.from.name} - ${this.openedRoute.to.name}?`).subscribe(decision => {
      if (decision) {
        this.as.deleteRoute(this.routeId).subscribe(data => {
          this.redirect('/admin/routes');
          this.snack.warning('Trasa została usunięta');
        });
      }
    });
  }

  public redirect(loc: string) {
    this.router.navigate([loc]);
  }

  saveAsNew() {
    const route = {
      from: this.openedRoute.from.id,
      to: this.openedRoute.to.id,
      stopIds: this.openedRoute.stops.map(s => s.id)
    };
    if (this.form.valid) {
      this.as.postRoute(route).subscribe(res => {
        this.redirect(`/admin/routes`);
        this.snack.success('Zapisano nową trasę');
      });
    }
  }

  ngOnInit() {
    this.as.getRoute(this.routeId).subscribe(data => {
      this.as.getCities().subscribe(stops => {
        this.openedRoute = {
          from: '',
          to: '',
          order: '',
          stop: []
        };
        this.openedRouteDiffer = this.differs.find(this.openedRoute).create();
        this.allStops = stops;
        this.openedRoute = data;
        if (this.openedRoute.order && this.openedRoute.stops) {
          const sortingArr = this.openedRoute.order.split(', ').map(el => parseInt(el, 10));
          this.openedRoute.stops.sort((a, b) => sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id));
        }
        this.form = this.formBuilder.group({
          StartLocFormControl: new FormControl(data.from.name, [Validators.required]),
          EndLocFormControl: new FormControl(data.to.name, [Validators.required]),
        });
      });
    });
  }

  updateStartEndValues() {
    if (this.openedRoute.stops.length) {
      this.openedRoute.from = this.openedRoute.stops[0];
      this.openedRoute.to = this.openedRoute.stops[this.openedRoute.stops.length - 1];
    }
  }

  ngDoCheck(): void {
    if (this.openedRoute) {
      const changes = this.openedRouteDiffer.diff(this.openedRoute.stops);
      if (changes) {
        this.updateStartEndValues();
      }
    }
  }

}
