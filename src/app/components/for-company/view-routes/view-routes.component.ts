import { Component, OnInit } from '@angular/core';
import {TableFieldModel} from '../../../modules/table-builder/table/table.component';
import {CompanyService} from '../../../services/company.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-view-routes',
  templateUrl: './view-routes.component.html',
  styleUrls: ['./view-routes.component.scss']
})
export class ViewRoutesComponent implements OnInit {
  tableFields: TableFieldModel[];
  routes;

  constructor(
    private cs: CompanyService,
    private as: AuthenticationService,
    private router: Router
  ) {
    this.tableFields = [
      {
        column: 'from',
        header: 'Przystanek początkowy'
      },
      {
        column: 'to',
        header: 'Przystanek końcowy'
      },
      {
        column: 'price',
        header: 'Cena'
      },
      {
        column: 'start',
        header: 'Start'
      },
      {
        column: 'end',
        header: 'Koniec'
      }
    ];
  }

  rowClick(data) {
    this.router.navigate([`for-company/view/${data.id}`]);
  }

  ngOnInit() {
    this.cs.getPassages(this.as.currentUserValue.company_id).subscribe(routes => {
      routes = routes.map(r => {
        let start = 'brak';
        let end = 'brak';
        if (r.departures && r.departures.length) {
          r.departures = r.departures.map(stop => {
            const sTime = new Date();
            sTime.setHours(stop.hours);
            sTime.setMinutes(stop.minutes);
            stop.time = sTime;
            return stop;
          });
          const startDate = new Date(r.departures.find(d => d.index === 0).time);
          const startHours = startDate.getHours() > 9 ? startDate.getHours() : `0${startDate.getHours()}`;
          const startMinutes = startDate.getMinutes() > 9 ? startDate.getMinutes() : `0${startDate.getMinutes()}`;
          const endDate = new Date(r.departures.find(d => d.index === r.departures.length - 1).time);
          const endHours = endDate.getHours() > 9 ? endDate.getHours() : `0${endDate.getHours()}`;
          const endMinutes = endDate.getMinutes() > 9 ? endDate.getMinutes() : `0${endDate.getMinutes()}`;
          start = `${startHours}:${startMinutes}`;
          end = `${endHours}:${endMinutes}`;
        }
        const price = `${r.price}zł`;
        return {...r, start, end, price };
      });
      this.routes = routes;
    });
  }

}
