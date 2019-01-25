import { Component, OnInit } from '@angular/core';
import { ComplianService } from '../complian.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ent-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.less']
})
export class ProgressComponent implements OnInit {
  public status1 = false; // 企业自查
  public status2 = false; // 协会核查
  public status3 = false; // 律所核查
  public status4 = false; // 会所核查
  public status5 = false; // 政府核查
  public hasText = false; // 状态文字
  flag1 = true;
  flag2 = true;
  flag3 = true;
  flag4 = true;
  flag5 = true;
  // left = '-3%';
  // right = '-3%';
  arr = {
    'name': '',
    lineStyle: {
      opacity: 0.9,
      width: 2,
      color: '#AFD5FD',
      background: 'red'
    },
    itemStyle: {
      color: 'green',
      borderColor: '#AFD5FD',
      borderWidth: 1.5,
      borderType: 'solid',
    },
    'children': [
      {
        name: '',
        lineStyle: {
          opacity: 0.9,
          width: 2,
          color: '#AFD5FD',
          background: 'red'
        },
        itemStyle: {
          color: 'green',
          borderColor: '#AFD5FD',
          borderWidth: 1.5,
          borderType: 'solid',
        },
      },
      {
        name: '',
        lineStyle: {
          opacity: 0.9,
          width: 2,
          color: '#AFD5FD',
          background: 'red'
        },
        itemStyle: {
          color: 'green',
          borderColor: '#AFD5FD',
          borderWidth: 1.5,
          borderType: 'solid',
        },
      },
      {
        name: '',
        lineStyle: {
          opacity: 0.9,
          width: 2,
          color: '#AFD5FD',
          background: 'red'
        },
        itemStyle: {
          color: 'green',
          borderColor: '#AFD5FD',
          borderWidth: 1.5,
          borderType: 'solid',
        },
      },
      {
        name: '',
        lineStyle: {
          opacity: 0.9,
          width: 2,
          color: '#AFD5FD',
          background: 'red'
        },
        itemStyle: {
          color: 'green',
          borderColor: '#AFD5FD',
          borderWidth: 1.5,
          borderType: 'solid',
        },
      }

    ]
  };
  options: any;
  mergeData = null;
  constructor(private _http: ComplianService, private cache: CacheService, private route: Router) { }

  ngOnInit() {
    this.getProgress();

    if (this.cache.get('EntInfo').typeIds !== '100/1') {
      this.flag2 = false;
      this.arr.children.length = 3;
      this.drwCharts(this.arr);
      this.mergeData = {
        series: this.options.series
      };
    } else {
      this.flag3 = false;
      this.flag4 = false;
      this.arr.children.length = 2;
      this.drwCharts(this.arr);
      this.mergeData = {
        series: this.options.series
      };
    }
  }

  getProgress() {
    const that = this;
    this._http.getProgressConfig().subscribe((res: any) => {
      if (res) {
        // this.cache.set('entMsgInfo', res);
        that.status1 = res.status === '1' ? false : true;
        that.hasText = res.status === '3' ? true : false;
        that.status2 = res.firstTrialStatus === '1' ? false : true;
        that.status3 = res.lawyerTrialStatus === '1' ? false : true;
        that.status4 = res.accountTrialStatus === '1' ? false : true;
        that.status5 = res.govTrialStatus === '1' ? false : true;
      }
      // that.firstApproveTime = res['data'].firstApproveTime;

    });
  }

  drwCharts(data) {
    const that = this;
    that.options = {
      series: [{
        type: 'tree',
        data: [data],
        // left: this.left,
        // right: this.right,
        top: '5%',
        bottom: '5%',
        symbol: 'emptyCircle',
        orient: 'vertical',
        expandAndCollapse: true,
        label: {
          normal: {
            position: 'top',
            rotate: 0,
            verticalAlign: 'bottom',
            align: 'center',
            fontSize: 14
          }
        },
        leaves: {
          label: {
            normal: {
              position: 'bottom',
              rotate: 0,
              verticalAlign: 'top',
              align: 'center'
            }
          }
        },
        animationDurationUpdate: 750
      }],

    };
  }

  toUpload() {
    this.route.navigate(['/app/complian/report']);
  }
}
