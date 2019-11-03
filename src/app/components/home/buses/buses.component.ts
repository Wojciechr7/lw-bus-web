import { Component, OnInit } from '@angular/core';
import {TableFieldModel} from '../../../modules/table-builder/table/table.component';
import {HomeService} from '../../../services/home.service';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.scss']
})
export class BusesComponent implements OnInit {

  tableFields: TableFieldModel[];
  data;

  constructor(
    private hs: HomeService
  ) {
    this.tableFields = [
      {
        column: 'name',
        header: 'Przewoźnik'
      },
      {
        column: 'numberPassages',
        header: 'Ilość obsługiwanych połączeń'
      }
    ];
  }

  ngOnInit() {
    this.hs.getCompanies().subscribe(data => {
      this.data = data;
    });
  }

}
