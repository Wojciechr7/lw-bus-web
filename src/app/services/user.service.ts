import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {GLOBAL} from '../config';

@Injectable({ providedIn: 'root' })
export class UserService {

    private url: string;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.URL;

    }


}
