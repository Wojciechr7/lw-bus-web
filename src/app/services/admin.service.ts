import { Injectable } from '@angular/core';
import {IUser} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {GLOBAL} from '../config';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {IStop} from '../models/stop';


export interface IUsersResponse {
  auth: IUser;
  users: Array<IUser>;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.URL;
  }

  public getUsers(): Observable<Array<IUser>> {
    return this.http.get<IUsersResponse>(`${this.url}/users/get`).pipe(map(response => response.users.map(data => {
      const user = {
        id: data.id,
        name: data.name,
        login: data.login,
        email: data.email
      };
      return user as IUser;
    })));
  }

  public createUser(user: IUser): Observable<number> {
    return this.http.post<number>(`${this.url}/users/create`, user);
  }

  public getUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.url}/users/get/${id}`).pipe(map(data => {
      const user = {
        id: data.id,
        name: data.name,
        login: data.login,
        email: data.email
      };
      return user as IUser;
    }));
  }

  public editUser(user: IUser, id: number): Observable<IUser> {
    return this.http.put<IUser>(`${this.url}/users/edit/${id}`, user).pipe(map(data => {
      const userStream = {
        id: data.id,
        name: data.name,
        login: data.login,
        email: data.email
      };
      return userStream as IUser;
    }));
  }


  public addCity(name: IStop): Observable<IStop> {
    return this.http.post<IStop>(`${this.url}/stops`, name);
  }

  public removeCity(id) {
    return this.http.delete(`${this.url}/stops/${id}`);
  }

  public getCities(): Observable<Array<IStop>> {
    return this.http.get<Array<IStop>>(`${this.url}/stops`);
  }

  public getRoutes(): Observable<any> {
    return this.http.get<Array<any>>(`${this.url}/routes`);
  }

  public getRoute(id): Observable<any> {
    return this.http.get<Array<any>>(`${this.url}/routes/${id}`);
  }

  public editRoute(route, id): Observable<any> {
    return this.http.put(`${this.url}/routes/${id}`, route);
  }

}
