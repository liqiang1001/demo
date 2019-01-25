import { Component, OnInit } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd';

@Component({
  selector: 'ent-enterinfo',
  templateUrl: './enterinfo.component.html',
  styleUrls: ['./enterinfo.component.less']
})
export class EnterinfoComponent implements OnInit {

  constructor(private iconserve: NzIconService) { }

  ngOnInit() {
    this.iconserve.fetchFromIconfont({
      scriptUrl: '//at.alicdn.com/t/font_971791_52zfhvisd8p.js'
    });
  }

}
