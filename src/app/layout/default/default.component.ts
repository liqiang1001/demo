import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { DefaultService } from './default.service';
import { CacheService } from '../../core/cache/cache.service';
import { LoadingService } from 'src/app/core/net/loading.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit, AfterViewChecked {
  MENU: any = [];
  isFetching = false;
  isCollapsed = false;
  isLoading = false;
  nav: [any] = [{ name: '首页' }];
  constructor(private cdRef: ChangeDetectorRef,
    private defServe: DefaultService,
    private cache: CacheService,
    public loading: LoadingService) { }

  ngOnInit() {
    const that = this;
    this.MENU = this.cache.get('MENU');
    this.defServe.dealMeun(this.cache.get('MenuRes'));
    this.defServe.getArea().subscribe(res => {
      const userData = {
        'typeMode': 'edit',
        ...res
      };
      that.cache.set('userData', userData);
    });
  }

  ngAfterViewChecked() {
    this.isLoading = this.loading.beforecount !== this.loading.aftercount;
    this.cdRef.detectChanges();
  }
  toggleMenu(e) {
    this.isCollapsed = e;
  }
}
