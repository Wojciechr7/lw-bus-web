import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.URL;
  }

  public getPassages({from, to, hour, date}): Observable<any> {
    console.log(`${this.url}/publicApi/passages/${from}/${to}/${hour}/${date}/${new Date().getFullYear()}`);
    return this.http.get(`${this.url}/publicApi/passages/${from}/${to}/${hour}/${date}/${new Date().getFullYear()}`);
  }

  public getStops(): Observable<any> {
    return this.http.get(`${this.url}/publicApi/stops`);
  }

  public getCompanies(): Observable<any> {
    return this.http.get(`${this.url}/publicApi/buses`);
  }

}
