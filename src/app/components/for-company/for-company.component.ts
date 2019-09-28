import { Component, OnInit } from '@angular/core';
import {AppService} from '../../services/app.service';

@Component({
  selector: 'app-for-company',
  templateUrl: './for-company.component.html',
  styleUrls: ['./for-company.component.scss']
})
export class ForCompanyComponent implements OnInit {

  constructor(private as: AppService) { }

  ngOnInit() {
    this.as.AppMode = 'company';
  }

}
