import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';

@Component({
  selector: 'ent-msginfo',
  templateUrl: './msginfo.component.html',
  styleUrls: ['./msginfo.component.less']
})
export class MsginfoComponent implements OnInit {
  dd = format(new Date(), 'YYYY-MM-DD');
  state = true;
  constructor() { }

  ngOnInit() {
    console.log(this.dd);
  }

  toggle() {
    this.state = !this.state;
    console.log(this.state);
  }
}
