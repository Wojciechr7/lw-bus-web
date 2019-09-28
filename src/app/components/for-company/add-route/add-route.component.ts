import {AfterViewChecked, Component, DoCheck, ElementRef, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DialogService} from '../../../services/dialog.service';
import {CompanyService} from '../../../services/company.service';
import {SnackbarService} from '../../../snackbars/snackbar.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {of} from 'rxjs';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit, AfterViewChecked, DoCheck {
  public form: FormGroup;
  openedRoute;
  allStops;
  allRoutes;
  days;
  freeDays;
  totalTime;
  @ViewChild('tooltip', {static: false}) tooltip: ElementRef;
  private openedRouteDiffer: KeyValueDiffer<string, any>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ds: DialogService,
    private cs: CompanyService,
    private snack: SnackbarService,
    private differs: KeyValueDiffers,
    private as: AuthenticationService
  ) {
    this.days = [
      {
        id: 1,
        name: 'Poniedziałek',
        checked: true
      },
      {
        id: 2,
        name: 'Wtorek',
        checked: true
      },
      {
        id: 3,
        name: 'Środa',
        checked: true
      },
      {
        id: 4,
        name: 'Czwartek',
        checked: true
      },
      {
        id: 5,
        name: 'Piątek',
        checked: true
      },
      {
        id: 6,
        name: 'Sobota',
        checked: true
      },
      {
        id: 7,
        name: 'Niedziela',
        checked: true
      }
    ];
    this.freeDays = [];
  }

  get f(): any {
    return this.form.controls;
  }

  addDate(value) {
    this.freeDays.push(value);
  }

  removeDate(i) {
    this.freeDays = this.freeDays.filter((day, index) => index !== i);
  }

  calculatePassageTime() {
    let time = this.openedRoute.stops.map((stop, index) => {
      if (!stop.time) {
        return 0;
      }
      const timeArr = stop.time.split(':').map(el => parseInt(el, 10));
      const minutes = timeArr[0] * 60 + timeArr[1];
      if (!index) {
        return 0;
      }
      let prev;
      for (let i = index - 1; i >= 0; i--) {
        if (this.openedRoute.stops[i].time !== undefined) {
          prev = this.openedRoute.stops[i].time.split(':').map(el => parseInt(el, 10));
          break;
        }
      }
      if (prev === undefined) {
        for (let i = 0; i < this.openedRoute.stops.length; i++) {
          if (this.openedRoute.stops[i].time !== undefined) {
            prev = this.openedRoute.stops[i].time.split(':').map(el => parseInt(el, 10));
            break;
          }
        }
      }
      const minutesPrev = prev[0] * 60 + prev[1];
      if (minutes < minutesPrev) {
        return 1440 - minutesPrev + minutes;
      }
      return minutes - minutesPrev;
    });
    if (time.length > 1) {
      time = time.reduce((prev, next) => prev + next);
      this.totalTime = [Math.floor(time / 60), time % 60];
    } else {
      this.totalTime = [0, 0];
    }
  }

  dayChange(id, val) {
    this.days[id].checked = val;
  }

  public redirect(loc: string) {
    this.router.navigate([loc]);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.openedRoute.stops, event.previousIndex, event.currentIndex);
  }

  deleteStop(id) {
    this.openedRoute.stops = this.openedRoute.stops.filter((s, index) => index !== id);
  }

  reverseStops() {
    this.openedRoute.stops.reverse();
  }

  addStop() {
    const filteredStops = this.allStops.filter(stop => !this.openedRoute.stops.map(el => el.id).includes(stop.id));
    this.ds.openAddInputDialog(filteredStops, this.openedRoute.stops, 'Wprowadź nazwę przystanku');
  }

  onSubmit() {
    if (this.form.valid) {
      if (!this.openedRoute.stops.some(stop => !stop.time)) {
        if (this.openedRoute.stops.length > 1) {
          this.validatePassageTime().subscribe(confirmPassageTime => {
            if (confirmPassageTime) {
              const data = {
                from: this.openedRoute.from,
                to: this.openedRoute.to,
                stops: this.openedRoute.stops.map(stop => {
                  return {
                    ...stop,
                    hours: parseInt(stop.time.split(':')[0], 10),
                    minutes: parseInt(stop.time.split(':')[1], 10),
                    stop_id: stop.id
                  };
                }),
                days: this.days.filter(day => day.checked).map(day => day.id),
                freeDays: this.freeDays.map(day => {
                  return {
                    day: day.getDate(),
                    month: day.getMonth() + 1
                  };
                }),
                price: this.f.PriceFormControl.value
              };
              this.cs.postPassage(data).subscribe(passage => {
                this.snack.success('Trasa została dodana');
                this.redirect('for-company/view');
              });
            }
          });
        } else {
          this.snack.warning('Dodaj więcej przystanków!');
        }
      } else {
        this.snack.warning('Uzupełnij wszystkie czasy odjazdów!');
      }
    } else {
      this.snack.warning('Nie wszystkie pola uzupełnione!');
    }

  }

  updateStopTime(value, index) {
    this.openedRoute.stops[index].time = value;
    this.calculatePassageTime();
  }

  importTemplate() {
    const tableFields = [
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
    const routes = this.allRoutes.map(r => {
      const copy = {...r};
      copy.from = r.from.name;
      copy.to = r.to.name;
      return copy;
    });
    this.ds.openFindDialog(tableFields, routes, 'Wybierz szablon trasy').subscribe(res => {
      if (res && res.decision && res.selected) {
        res.selected.stops = res.selected.stops.map((stop, index) => {
          return {index, name: stop.name, time: null, id: stop.id};
        });
        this.openedRoute = {...res.selected};

      }

    });
  }

  updateStartEndValues() {
    if (this.openedRoute.stops.length) {
      this.openedRoute.from = this.openedRoute.stops[0].name;
      this.openedRoute.to = this.openedRoute.stops[this.openedRoute.stops.length - 1].name;
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      PriceFormControl: new FormControl('', [Validators.required]),
    });

    this.cs.getCities().subscribe(stops => {
      this.allStops = stops;
      this.openedRoute = {
        from: '',
        to: '',
        order: '',
        stops: []
      };
      this.openedRouteDiffer = this.differs.find(this.openedRoute).create();
      this.cs.getRoutes().subscribe(data => {
        this.allRoutes = data;
        // @ts-ignore
        this.tooltip.show();
      });
    });

  }

  updateStopIndexes() {
    this.openedRoute.stops.forEach((stop, index) => {
      stop.index = index;
    });
  }

  ngDoCheck(): void {
    if (this.openedRoute) {
      const changes = this.openedRouteDiffer.diff(this.openedRoute.stops);
      if (changes) {
        this.updateStartEndValues();
        this.updateStopIndexes();
        this.calculatePassageTime();
      }
    }

  }

  ngAfterViewChecked(): void {

  }

  private validatePassageTime() {
    if (this.totalTime[0] >= 3) {
      return this.ds.openConfirmDialog(`Czas przejazdu to ${this.totalTime[0]}h, ${this.totalTime[1]}min. Czy na pewno zapisać trasę?`);
    }
    return of(true);
  }

}
