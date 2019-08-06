import {Component, OnInit} from '@angular/core';
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
export class SingleRouteComponent implements OnInit {

  routeId;
  openedRoute;
  allStops;
  public form: FormGroup;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.openedRoute.stop, event.previousIndex, event.currentIndex);
  }


  constructor(
    private route: ActivatedRoute,
    private as: AdminService,
    private formBuilder: FormBuilder,
    private ds: DialogService,
    private router: Router,
    private snack: SnackbarService
  ) {
    this.routeId = this.route.snapshot.paramMap.get('id');
  }

  deleteStop(id) {
    this.openedRoute.stop = this.openedRoute.stop.filter(s => s.id !== id);
  }

  reverseStops() {
    this.openedRoute.stop.reverse();
  }

  reverseInputs() {
    const temp = this.f.StartLocFormControl.value;
    this.f.StartLocFormControl.setValue(this.f.EndLocFormControl.value);
    this.f.EndLocFormControl.setValue(temp);
    [this.openedRoute.from, this.openedRoute.to] = [this.openedRoute.to, this.openedRoute.from];
  }

  onSubmit() {
    const route = {
      id: this.openedRoute.id,
      from: this.openedRoute.from.id,
      to: this.openedRoute.to.id,
      order: this.openedRoute.stop.map(s => s.id).join(', '),
      stopIds: this.openedRoute.stop.map(s => s.id)
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
    const filteredStops = this.allStops.filter(stop => !this.openedRoute.stop.map(el => el.id).includes(stop.id));
    this.ds.openAddDialog(filteredStops, this.openedRoute.stop, 'Przystanki');
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
      order: this.openedRoute.stop.map(s => s.id).join(', '),
      stopIds: this.openedRoute.stop.map(s => s.id)
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
        this.allStops = stops;
        this.openedRoute = data;
        if (this.openedRoute.order && this.openedRoute.stop) {
          const sortingArr = this.openedRoute.order.split(', ').map(el => parseInt(el, 10));
          this.openedRoute.stop.sort((a, b) => sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id));
        }
        this.form = this.formBuilder.group({
          StartLocFormControl: new FormControl(data.from.name, [Validators.required]),
          EndLocFormControl: new FormControl(data.to.name, [Validators.required]),
        });
      });
    });
  }

}
