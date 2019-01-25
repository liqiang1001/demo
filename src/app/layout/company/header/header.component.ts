import { Component, OnInit, Input } from '@angular/core';
import { CacheService } from '../../../core/cache/cache.service';

@Component({
  selector: 'layout-header2',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class Header2Component implements OnInit {
  @Input() menu;
  UserInfo: any;
  constructor(private cache: CacheService) { }

  ngOnInit() {
    this.UserInfo = this.cache.get('userInfo');
  }

}
