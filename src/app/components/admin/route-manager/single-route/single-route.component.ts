import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AdminService} from '../../../../services/admin.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DialogService} from '../../../../services/dialog.service';

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


  constructor(private route: ActivatedRoute, private as: AdminService, private formBuilder: FormBuilder, private ds: DialogService) {
    this.routeId = this.route.snapshot.paramMap.get('id');
  }

  deleteStop(id) {
    this.openedRoute.stop = this.openedRoute.stop.filter(s => s.id !== id);
  }

  onSubmit() {
    const route = {
      id: this.openedRoute.id,
      from: this.f.StartLocFormControl.value,
      to: this.f.EndLocFormControl.value,
      stopIds: this.openedRoute.stop.map(s => s.id)
    };
    this.as.editRoute(route, this.routeId).subscribe(res => {
      console.log(res);
    });
  }

  get f(): any {
    return this.form.controls;
  }

  addStop() {
    const filteredStops = this.allStops.filter(stop => !this.openedRoute.stop.map(el => el.id).includes(stop.id));
    this.ds.openAddDialog(filteredStops, this.openedRoute.stop, 'Przystanki');
  }

  ngOnInit() {
    this.as.getRoute(this.routeId).subscribe(data => {
      console.log(data);
      this.as.getCities().subscribe(stops => {
        this.allStops = stops;
        this.openedRoute = data;
        this.form = this.formBuilder.group({
          StartLocFormControl: new FormControl(data.from, [Validators.required]),
          EndLocFormControl: new FormControl(data.to, [Validators.required]),
        });
      });

    });
  }

}
