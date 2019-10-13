import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DialogService} from '../../../services/dialog.service';
import {CompanyService} from '../../../services/company.service';
import {SnackbarService} from '../../../snackbars/snackbar.service';
import {HomeService} from '../../../services/home.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-find-routes',
  templateUrl: './find-routes.component.html',
  styleUrls: ['./find-routes.component.scss']
})
export class FindRoutesComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  filteredOptionsFrom: Observable<string[]>;
  filteredOptionsTo: Observable<string[]>;
  public allStops;
  private fullDay = false;
  step;
  foundPassages = [];
  intervalRef;
  startDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ds: DialogService,
    private snack: SnackbarService,
    private hs: HomeService
  ) { }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep(event) {
    event.stopPropagation();
    this.step--;
  }

  calculatePassageTime(stops) {
    const start = stops.find(stop => stop.name === this.f.StartLocFormControl.value);
    const end = stops.find(stop => stop.name === this.f.EndLocFormControl.value);
    let startFound = false;
    let endFound = false;
    const time = stops.map((stop, index) => {
      if (endFound) {
        return 0;
      }
      if (!stop.time) {
        return 0;
      }
      if (stop.name === start.name) {
        startFound = true;
        return 0;
      } else if (stop.name === end.name) {
        endFound = true;
      }
      if (!index) {
        return 0;
      }
      if (startFound) {
        const timeArr = [new Date(stop.time).getHours(), new Date(stop.time).getMinutes()];
        const minutes = timeArr[0] * 60 + timeArr[1];
        const prev = [new Date(stops[index - 1].time).getHours(), new Date(stops[index - 1].time).getMinutes()];
        const minutesPrev = prev[0] * 60 + prev[1];
        if (minutes < minutesPrev) {
          return 1440 - minutesPrev + minutes;
        }
        return minutes - minutesPrev;
      } else {
        return 0;
      }
    }).reduce((prev, next) => prev + next);
    return `${Math.floor(time / 60)}h ${time % 60}min`;
  }

  findDepartureTime(name, passageIndex) {
    const departureTime = new Date(this.foundPassages[passageIndex].departures.find(d => d.name === name).time);
    const hours = departureTime.getHours() > 9 ? departureTime.getHours() : `0${departureTime.getHours()}`;
    const minutes = departureTime.getMinutes() > 9 ? departureTime.getMinutes() : `0${departureTime.getMinutes()}`;
    return `${hours}:${minutes}`;
  }

  reverseInputs() {
    const temp = this.f.StartLocFormControl.value;
    this.f.StartLocFormControl.setValue(this.f.EndLocFormControl.value);
    this.f.EndLocFormControl.setValue(temp);
  }

  private _filter(value): string[] {
    const filterValue = this.normalize(value);
    return this.allStops.filter(option => this.normalize(option.name).indexOf(filterValue) === 0).map(stop => stop.name);
  }

  get f(): any {
    return this.form.controls;
  }

  private normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0142/g, 'l');
  }

  private getSelectedStopsIds() {
    const start = this.allStops.find(stop => this.normalize(stop.name).indexOf(this.normalize(this.f.StartLocFormControl.value)) === 0);
    const end = this.allStops.find(stop => this.normalize(stop.name).indexOf(this.normalize(this.f.EndLocFormControl.value)) === 0);
    if (!start) {
      this.snack.warning(`Nie znaleziono przystanku ${this.f.StartLocFormControl.value}`);
      return false;
    } else if (!end) {
      this.snack.warning(`Nie znaleziono przystanku ${this.f.EndLocFormControl.value}`);
      return false;
    }
    this.f.StartLocFormControl.setValue(start.name);
    this.f.EndLocFormControl.setValue(end.name);
    if (start.id === end.id) {
      this.snack.warning(`Przystanki nie mogą być identyczne`);
      return false;
    }
    return {start: start.id, end: end.id};
  }

  onSubmit() {
    if (this.form.valid) {
      const stopIds = this.getSelectedStopsIds();
      if (stopIds) {
        if (this.intervalRef) {
          clearInterval(this.intervalRef);
        }
        const currentDate = new Date();
        const data = {
          from: stopIds.start,
          to: stopIds.end,
          hour: this.f.FullDayFormControl.value ? '00:00' : `${currentDate.getHours()}:${currentDate.getMinutes()}`,
          date: `${this.f.DateFormControl.value.getDate()}-${this.f.DateFormControl.value.getMonth() + 1}`
        };
        this.hs.getPassages(data).subscribe(passages => {
          console.log(passages);
          if (!passages.length) {
            this.snack.warning('Nie znaleziono żadnych połączeń');
          }
          passages = passages.map(p => {
            return {
              ...p,
              departures: p.departures.map(d => {
                const dTime = new Date();
                dTime.setHours(d.hours);
                dTime.setMinutes(d.minutes);
                return {
                  ...d,
                  time: dTime
                };
              })
            };
          });
          this.foundPassages = this.sortPassages(passages);
          this.updateDifferenceTimes();
          this.intervalRef = setInterval(() => {
            this.updateDifferenceTimes();
          }, 5000);
        });
      }
    }
  }

  private sortPassages(passages) {
    return passages.map(p => {
      return p.departures.find(d => d.name === this.f.StartLocFormControl.value);
    })
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()).map(sorted => {
      return passages.find(pas => pas.id === sorted.passage_id);
    });
  }

  dateChangeEvent(date) {
    const day = date.getDate();
    const month = date.getMonth();
    const current = new Date();
    if (day === current.getDate() && month === current.getMonth()) {
      this.f.FullDayFormControl.setValue(false);
      this.f.FullDayFormControl.enable();
    } else {
      this.f.FullDayFormControl.setValue(true);
      this.f.FullDayFormControl.disable();
    }
  }

  private updateDifferenceTimes() {
    this.foundPassages.map((p, index) => {
      const departureTime = new Date(p.departures.find(d => d.name === this.f.StartLocFormControl.value).time);
      departureTime.setDate(this.f.DateFormControl.value.getDate());
      departureTime.setMonth(this.f.DateFormControl.value.getMonth());
      const differenceSeconds = (departureTime.getTime() - new Date().getTime()) / 1000;
      if (differenceSeconds < 0) {
        this.foundPassages[index]['departureTime'] = '';
      } else {
        this.foundPassages[index]['departureTime'] = `${Math.floor(differenceSeconds / 3600)}h ${Math.floor(differenceSeconds % 3600 / 60)}min`;
      }
    });
  }

  convertStopTime(time) {
    return new Date(time);
  }

  ngOnInit() {
    this.hs.getStops().subscribe(stops => {
      console.log(stops);
      this.allStops = stops;
      this.form = this.formBuilder.group({
        StartLocFormControl: new FormControl('', [Validators.required]),
        EndLocFormControl: new FormControl('', [Validators.required]),
        DateFormControl: new FormControl({value: new Date(), disabled: true}, [Validators.required]),
        FullDayFormControl: new FormControl({value: false, disabled: false})
      });
      this.filteredOptionsFrom = this.f.StartLocFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.filteredOptionsTo = this.f.EndLocFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
        this.form.valueChanges.subscribe(value => {
          this.foundPassages = [];
          if (this.intervalRef) {
            clearInterval(this.intervalRef);
          }
        });
    });

  }

  ngOnDestroy(): void {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

}
