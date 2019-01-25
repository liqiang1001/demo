import { Component, OnInit } from '@angular/core';
import { AppdashboardService } from '../appdashboard.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { NzIconService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  List = [];
  constructor(private iconserve: NzIconService,
     private http: AppdashboardService,
     private cache: CacheService,
     private router: Router) { }

  ngOnInit() {
    this.iconserve.fetchFromIconfont({
      scriptUrl: '//at.alicdn.com/t/font_971791_52zfhvisd8p.js'
    });
    this.getHistoryList();
  }

  getHistoryList() {
    this.http.getHistoryList({
      enterId: this.cache.get('userId'),
      id: this.cache.get('taskInfo').id
    }).subscribe(res => {
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const element = {
            year: key,
            info: res[key]
          };
          this.List.push(element);
        }
      }
      // this.List = res.map(res=>{});
    });
  }

  goDetail(item) {
    this.cache.set('HistaskInfo', item);
    this.router.navigate(['/app/report']);
  }
}
