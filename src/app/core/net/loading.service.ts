import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public beforecount = 0;
  public aftercount = 0;
  constructor() { }

  public addbefore() {
    ++this.beforecount;
    console.log(this.beforecount);
  }

  public addafter() {
    ++this.aftercount;
    console.log(this.aftercount);
  }
}
