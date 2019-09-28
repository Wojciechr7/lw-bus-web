import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {IStop} from '../models/stop';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.URL;
  }

  public getCities(): Observable<Array<IStop>> {
    return this.http.get<Array<IStop>>(`${this.url}/stopsUser`);
  }

  public getRoutes(): Observable<any> {
    return this.http.get<Array<any>>(`${this.url}/templatesUser`);
  }

  public getRoute(id): Observable<any> {
    return this.http.get<Array<any>>(`${this.url}/templatesUser/${id}`);
  }

  public postPassage(passage): Observable<any> {
    return this.http.post(`${this.url}/passagesUser`, passage);
  }

  public getPassages(company_id): Observable<any> {
    return this.http.get(`${this.url}/passagesUser/${company_id}`);
  }

  public getPassage(id): Observable<any> {
    return this.http.get(`${this.url}/passagesUser/show/${id}`);
  }

  public editPassage(passage, id): Observable<any> {
    return this.http.put(`${this.url}/passagesUser/${id}`, passage);
  }

  public deletePassage(id): Observable<any> {
    return this.http.delete(`${this.url}/passagesUser/${id}`);
  }

}
