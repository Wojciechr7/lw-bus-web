import {
  AfterViewChecked,
  Component,
  DoCheck,
  ElementRef,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit, QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from '../../../services/dialog.service';
import {CompanyService} from '../../../services/company.service';
import {SnackbarService} from '../../../snackbars/snackbar.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {of} from 'rxjs';

@Component({
  selector: 'app-single-route-user',
  templateUrl: './single-route.component.html',
  styleUrls: ['./single-route.component.scss']
})
export class SingleRouteUserComponent implements OnInit, AfterViewChecked, DoCheck {
  public form: FormGroup;
  openedRoute;
  allStops;
  allRoutes;
  days;
  freeDays;
  routeId;
  totalTime;
  private openedRouteDiffer: KeyValueDiffer<string, any>;
  private reverseUsed = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ds: DialogService,
    private cs: CompanyService,
    private snack: SnackbarService,
    private differs: KeyValueDiffers,
    private as: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.days = [
      {
        id: 1,
        name: 'Poniedziałek',
        checked: false
      },
      {
        id: 2,
        name: 'Wtorek',
        checked: false
      },
      {
        id: 3,
        name: 'Środa',
        checked: false
      },
      {
        id: 4,
        name: 'Czwartek',
        checked: false
      },
      {
        id: 5,
        name: 'Piątek',
        checked: false
      },
      {
        id: 6,
        name: 'Sobota',
        checked: false
      },
      {
        id: 7,
        name: 'Niedziela',
        checked: false
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

  dayChange(id, val) {
    this.days[id].checked = val;
  }

  public redirect(loc: string) {
    this.router.navigate([loc]);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.openedRoute.departures, event.previousIndex, event.currentIndex);
  }

  deleteStop(id) {
    this.openedRoute.departures = this.openedRoute.departures.filter((s, index) => index !== id);
  }

  reverseStops() {
    this.ds.openConfirmDialog(`Czy na pewno odwrócić kolejność przystanków? Czasy odjazdów zostaną zresetowane.`).subscribe(decision => {
      if (decision) {
        this.reverseUsed = true;
        this.openedRoute.departures.reverse();
        this.openedRoute.departures = this.openedRoute.departures.map(d => {
          return {
            ...d,
            time: ''
          };
        });
      }
    });
  }

  addStop() {
    const filteredStops = this.allStops.filter(stop => !this.openedRoute.departures.map(el => el.name).includes(stop.name));
    this.ds.openAddInputDialog(filteredStops, this.openedRoute.departures, 'Wprowadź nazwę przystanku');
  }

  calculatePassageTime() {
    if (this.openedRoute.departures.length) {
      let time = this.openedRoute.departures.map((stop, index) => {
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
          if (this.openedRoute.departures[i].time !== undefined) {
            prev = this.openedRoute.departures[i].time.split(':').map(el => parseInt(el, 10));
            break;
          }
        }
        if (prev === undefined) {
          for (let i = 0; i < this.openedRoute.departures.length; i++) {
            if (this.openedRoute.departures[i].time !== undefined) {
              prev = this.openedRoute.departures[i].time.split(':').map(el => parseInt(el, 10));
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
  }

  noDuplicates() {
    return this.openedRoute.departures.map(el => el.name).every((e, i, a) => a.indexOf(e) === i);
  }

  private validateReverseUsed() {
    if (this.reverseUsed) {
      return this.ds.openConfirmDialog(`Czy na pewno chcesz nadpisać aktualnie wybraną trasę? Jeżeli tworzysz trasę powrotną, użyj przycisku "Zapisz jako nową trasę".`);
    }
    return of(true);
  }

  onSubmit() {
    if (this.form.valid) {
      if (!this.openedRoute.departures.some(stop => !stop.time)) {
        if (this.openedRoute.departures.length > 1) {
          if (this.noDuplicates()) {
            this.validateReverseUsed().subscribe(reverseUsed => {
              if (reverseUsed) {
                this.validatePassageTime().subscribe(confirmPassageTime => {
                  if (confirmPassageTime) {
                    const data = {
                      from: this.openedRoute.from,
                      to: this.openedRoute.to,
                      stops: this.openedRoute.departures.map(stop => {
                        return {
                          ...stop,
                          hours: parseInt(stop.time.split(':')[0], 10),
                          minutes: parseInt(stop.time.split(':')[1], 10)
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
                    this.cs.editPassage(data, this.routeId).subscribe(passage => {
                      this.snack.success('Trasa została zmodyfikowana');
                      this.redirect('for-company/view');
                    });
                  }
                });
              }
            });
          } else {
            this.snack.warning('Przystanki nie mogą się powtarzać!');
          }
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

  saveAsNew() {
    if (this.form.valid) {
      if (!this.openedRoute.departures.some(stop => !stop.time)) {
        if (this.openedRoute.departures.length > 1) {
          if (this.noDuplicates()) {
            this.validatePassageTime().subscribe(confirmPassageTime => {
              if (confirmPassageTime) {
                const data = {
                  from: this.openedRoute.from,
                  to: this.openedRoute.to,
                  stops: this.openedRoute.departures.map(stop => {
                    return {
                      ...stop,
                      hours: parseInt(stop.time.split(':')[0], 10),
                      minutes: parseInt(stop.time.split(':')[1], 10)
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
                  this.snack.success('Nowa trasa została utworzona');
                  this.redirect('for-company/view');
                });
              }
            });
          } else {
            this.snack.warning('Przystanki nie mogą się powtarzać!');
          }
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
    this.openedRoute.departures[index].time = value;
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
        if (res.selected.stops.length) {
          res.selected.stops = res.selected.stops.map((stop, index) => {
            return {index, name: stop.name, time: null, stop_id: stop.id, id: stop.id};
          });
          this.openedRoute.departures = [...res.selected.stops];
        } else {
          this.openedRoute.departures = [];
        }
      }
    });
  }

  updateStartEndValues() {
    if (this.openedRoute.departures.length) {
      this.openedRoute.from = this.openedRoute.departures[0].name;
      this.openedRoute.to = this.openedRoute.departures[this.openedRoute.departures.length - 1].name;
    }
  }

  ngOnInit() {
    this.routeId = this.route.snapshot.paramMap.get('id');
    this.form = this.formBuilder.group({
      PriceFormControl: new FormControl('', [Validators.required]),
    });

    this.cs.getCities().subscribe(stops => {
      this.allStops = stops;
      this.openedRoute = {
        from: '',
        to: '',
        order: '',
        departures: []
      };
      this.openedRouteDiffer = this.differs.find(this.openedRoute).create();
      this.cs.getRoutes().subscribe(data => {
        this.allRoutes = data;
        this.cs.getPassage(this.routeId).subscribe(foundPassage => {
          this.openedRoute.from = foundPassage.from;
          this.openedRoute.to = foundPassage.to;
          this.openedRoute.departures = foundPassage.departures.map(stop => {
            stop.time = `${stop.hours > 9 ? stop.hours : '0' + stop.hours}:${stop.minutes > 9 ? stop.minutes : '0' + stop.minutes}`;
            return stop;
          });
          this.f.PriceFormControl.setValue(foundPassage.price);
          foundPassage.days.forEach(day => {
            this.days[day.id - 1].checked = true;
          });
          foundPassage.free_days.forEach(el => {
            const newDate = new Date();
            newDate.setMonth(el.month - 1);
            newDate.setDate(el.day);
            this.freeDays.push(newDate);
          });
        });
      });
    });
  }

  deletePassage() {
    this.ds.openConfirmDialog(`Czy na pewno chcesz usunąć trasę?`).subscribe(decision => {
      if (decision) {
        this.cs.deletePassage(this.routeId).subscribe((res) => {
          this.redirect('for-company/view');
          this.snack.warning('Trasa została usunięta');
        });
      }
    });
  }

  updateStopIndexes() {
    if (this.openedRoute.departures.length) {
      this.openedRoute.departures.forEach((stop, index) => {
        stop.index = index;
      });
    }
  }

  ngDoCheck(): void {
    if (this.openedRoute) {
      const changes = this.openedRouteDiffer.diff(this.openedRoute.departures);
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
