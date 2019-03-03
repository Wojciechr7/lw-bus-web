import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GLOBAL} from '../config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string;
  public loading: boolean;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.URL;
  }



}
