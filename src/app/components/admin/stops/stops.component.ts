import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../../services/admin.service';
import {IStop} from '../../../models/stop';
import {DialogService} from '../../../services/dialog.service';

@Component({
  selector: 'app-stops',
  templateUrl: './stops.component.html',
  styleUrls: ['./stops.component.scss']
})
export class StopsComponent implements OnInit {

  public cityForm: FormGroup;
  public stops: Array<IStop>;

  constructor(private formBuilder: FormBuilder, private as: AdminService, private ds: DialogService) {
  }

  public onSubmit() {
    if (!this.cityForm.invalid) {
      this.as.addCity({name: this.cityForm.value.city} as IStop).subscribe((data: IStop) => {
        console.log(data);
        this.stops = [
          ...this.stops,
          data
        ];
        this.cityForm.get('city').setValue('');
      });
    }
  }

  removeStop(stop) {
    this.ds.openConfirmDialog(`Czy na pewno chcesz usunąć przystanek ${stop.name}?`).subscribe(decision => {
      if (decision) {
        this.as.removeCity(stop.id).subscribe(() => {
          this.stops = this.stops.filter(s => s.name !== stop.name);
        });
      }
    });
  }

  ngOnInit() {
    this.cityForm = this.formBuilder.group({
      city: ['', Validators.required]
    });
    this.as.getCities().subscribe(stops => {
      this.stops = stops;
    });
  }

}
