import { Component, OnInit } from '@angular/core';
import { AppdashboardService } from './appdashboard.service';
import { CacheService } from 'src/app/core/cache/cache.service';

@Component({
  selector: 'app-appdashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class AppDashboardComponent implements OnInit {
  EntInfo;
  EnterConf;
  TaskList;
  constructor(private _http: AppdashboardService, private cache: CacheService) { }

  ngOnInit() {
    this.getEntInfo(() => {
      this.getEnterConf();
      this.getTaskList();
      this.getProgress();
    });
  }

  getEntInfo(fn) {
    if (this.cache.get('EntInfo')) {
      this.EntInfo = this.cache.get('EntInfo');
      fn();
    } else {
      this._http.getEntInfo().subscribe(res => {
        this.cache.set('EntInfo', res);
        this.EntInfo = res;
        fn();
      });
    }
  }

  getEnterConf() {
    this._http.getEnterInfo(this.EntInfo.id, this.cache.get('userId')).subscribe(res => {
      this.EnterConf = res;
    });
  }

  getProgress() {
    this._http.getProgressConfig().subscribe(res => {
      this.cache.set('entMsgInfo', res);
    });
  }

  getTaskList() {
    this._http.getTeskList(this.EntInfo.id, this.cache.get('userId')).subscribe(res => {
      this.TaskList = res;
      console.log(res);
    });
  }

}
