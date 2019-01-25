import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ent-entinfo',
  templateUrl: './entinfo.component.html',
  styleUrls: ['./entinfo.component.less']
})
export class EntinfoComponent implements OnInit {
  @Input() entinfo;
  constructor() { }

  ngOnInit() {
  }

}
