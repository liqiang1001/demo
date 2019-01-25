import { Component, OnInit, Input } from '@angular/core';
import { CacheService } from '../../../core/cache/cache.service';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Input() menu;
  UserInfo: any;
  constructor(private cache: CacheService) { }

  ngOnInit() {
    this.UserInfo = this.cache.get('userInfo');
  }
  signOut() {
    console.log('退出');
    const systemUrl = this.cache.get('systemUrl');
    const systemconfig = this.cache.get('systemconfig');
    const complianceCheckConfig = this.cache.get('complianceCheckConfig');
    this.cache.clear();
    this.cache.set('systemUrl', systemUrl);
    this.cache.set('systemconfig', systemconfig);
    this.cache.set('complianceCheckConfig', complianceCheckConfig);

  }

}
