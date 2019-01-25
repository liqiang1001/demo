import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from 'src/app/core/cache/cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StatisticsService } from '../../statistics.service';
import { DictService } from 'src/app/core/dict/dict.service';

@Component({
  selector: 'app-progress-detail',
  templateUrl: './progress-detail.component.html',
  styleUrls: ['./progress-detail.component.less']
})
export class ProgressDetailComponent implements OnInit {
  rectificationDetail: any;
  options: any;
  options1: any;
  options2: any;
  dataSource1: any;

  constructor(private nzMessageService: NzMessageService,
    private cache: CacheService,
    public router: Router,
    private http: StatisticsService, private dict: DictService) { }

  ngOnInit() {
    // 模拟数据
    this.rectificationDetail = this.cache.get('rectificationDetail');
    this.getMonitorDetails();
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  // 获取图表信息
  getMonitorDetails() {
    const list = {
      enterpriseId: this.rectificationDetail.sysEnterprise.id,
      userId: this.cache.get('userId')
    };
    this.http.getMonitorDetails(list).subscribe((res: any) => {
      console.log(res);
      const dataSource1 = res;
      const chartData1 = [
        { name: '整改以来存量规模', type: 'bar', label: { normal: { show: true, position: 'inside' } }, data: dataSource1.since_compliance },
        { name: '整改以来存量不合规业务规模', type: 'bar', stack: '总量', label: { normal: { show: true } }, data: dataSource1.since_notCompliance }
      ];
      this.drwCharts('整改以来存量规模变化情况', chartData1, dataSource1.xAxis);
      this.options1 = this.options;
      const chartData2 = [
        { name: '月末机构存量规模', type: 'bar', label: { normal: { show: true, position: 'inside' } }, data: dataSource1.current_compliance },
        { name: '月末机构存量不合规业务规模', type: 'bar', stack: '总量', label: { normal: { show: true } }, data: dataSource1.current_notCompliance }
      ];
      this.drwCharts('月末存量规模变化情况', chartData2, dataSource1.xAxis);
      this.options2 = this.options;
      // this.drwCharts('整改以来存量规模变化情况', chartData1, dataSource1.xAxis);
    });
  }

  drwCharts(title, dataSource, xAxisData) {
    this.options = {
      title: {
        text: title
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['应收金额', '应兑付金额', '缺口']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '50',
        containLabel: true
      },
      dataZoom: [{
        type: 'slider',
        start: 0,
        end: 100,
        showDetail: false,
        top: 360,
        z: 0
      }],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} 万元'
          },
        }
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: xAxisData
        }
      ],
      series: dataSource
    };
  }
}
