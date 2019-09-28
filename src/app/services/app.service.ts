import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // standard, admin, company
  private appMode: string;

  constructor() {
  }

  set AppMode(am: string) {
    this.appMode = am;
  }

  get AppMode(): string {
    return this.appMode;
  }


}
