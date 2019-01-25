import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from 'src/app/core/cache/cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StatisticsService } from '../../statistics.service';
import { DictService } from 'src/app/core/dict/dict.service';

@Component({
  selector: 'app-mobility-detail',
  templateUrl: './mobility-detail.component.html',
  styleUrls: ['./mobility-detail.component.less']
})
export class MobilityDetailComponent implements OnInit {
  mobilityDetail: any;
  options: any;
  options2: any;

  constructor(private nzMessageService: NzMessageService,
    private cache: CacheService,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private http: StatisticsService, private dict: DictService) { }

  ngOnInit() {
    // 模拟数据

    const dataSource1 = {
      ft_recycle: [12, 32, 34, 45, 65, 76, 78],
      ft_margin: [12, 0, 34, -45, -65, -76, -78],
      ft_expend: [12, 0, 34, -45, -65, -76, -78],
      xAxis: ['2018-05', '2018-06', '2018-07', '2018-08', '2018-09', '2018-10', '2018-11']
    };
    const chartData1 = [
      { name: '应收金额', type: 'bar', label: { normal: { show: true, position: 'inside' } }, data: dataSource1.ft_recycle },
      { name: '缺口', type: 'bar', stack: '总量', label: { normal: { show: true } }, data: dataSource1.ft_margin },
      { name: '应兑付金额', type: 'bar', stack: '总量', label: { normal: { show: true } }, data: dataSource1.ft_expend }
    ];
    this.drwCharts('月存量情况', chartData1, dataSource1.xAxis);
    this.options2 = this.options;
    this.getMonitorDetails();
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  // 获取图表信息
  getMonitorDetails() {
    const list = {

    };
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
