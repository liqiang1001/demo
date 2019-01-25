import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core';
// import * as echarts from 'echart';
// import 'echarts-liquidfill';

@Component({
  selector: 'app-waterball',
  templateUrl: './waterball.component.html',
  styleUrls: ['./waterball.component.less']
})
export class WaterballComponent implements OnInit, OnChanges {
  @Input() WaterInfo;
  @ViewChild('waterbox') container;
  val1data2 = [{
    value: 0,
    name: '已提交企业',
    itemStyle: {
      normal: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#41D6FB' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#8251FF' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      }
    }
  },
  {
    value: 0,
    name: '未提交企业',
    itemStyle: {
      normal: {
        color: '#F6F6F6'
      }
    }
  }
  ];

  arr: any[] = ['middleLost', 0, this.val1data2];
  ngOnInit() {

  }
  // const that = this;
  //   const ec = echarts as any;
  //   if (!this.WaterInfo) {
  //     return;
  //   }
  //   this.val1data2[0].value = this.WaterInfo.receive;
  //   this.val1data2[1].value = this.WaterInfo.receive === 0 ? 1 : this.WaterInfo.noreceive;
  //   this.arr[1] = this.WaterInfo.all ? (this.WaterInfo.receive / this.WaterInfo.all).toFixed(4) : 0;
  //   const container = this.container.nativeElement;
  //   const chart = ec.init(container);
  //   console.log(that.arr, this.WaterInfo.receive, this.WaterInfo.all);
  //   chart.setOption(({
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: function (res) {
  //         if (res.componentSubType === 'liquidFill') {
  //           return;
  //         } else {
  //           return '<span class="ii" style="background:' +
  //             res.color + ' "></span>' + res.name + ':<br/> ' +
  //             (res.percent === 100 ? 0 : res.data.value) + ' (' + res.percent + '%)';
  //         }
  //       }
  //     },
  //     series: [{
  //       type: 'liquidFill',
  //       amplitude: '5%',
  //       radius: '90%',
  //       data: [{
  //         value: that.arr[1]
  //       }, {
  //         value: (that.arr[1] - 0.05) > 0 ? (that.arr[1] - 0.05) : 0
  //       }],
  //       color: [{
  //         type: 'linear',
  //         x: 0,
  //         y: 0,
  //         x2: 0,
  //         y2: 1,
  //         colorStops: [{
  //           offset: 0,
  //           color: '#8251FF' // 0% 处的颜色
  //         }, {
  //           offset: 1,
  //           color: '#41D6FB' // 100% 处的颜色
  //         }],
  //         globalCoord: false
  //       }, {
  //         type: 'linear',
  //         x: 0,
  //         y: 0,
  //         x2: 0,
  //         y2: 1,
  //         colorStops: [{
  //           offset: 0,
  //           color: '#8251FF' // 0% 处的颜色
  //         }, {
  //           offset: 1,
  //           color: '#41D6FB' // 100% 处的颜色
  //         }],
  //         globalCoord: false
  //       }],
  //       center: ['50%', '50%'],
  //       backgroundStyle: {
  //         color: '#fff'
  //       },
  //       outline: {
  //         itemStyle: {
  //           borderColor: '#86c5ff',
  //           borderWidth: 0
  //         },
  //         borderDistance: 0
  //       }
  //     }, {
  //       type: 'pie',
  //       radius: ['93%', '97%'],
  //       hoverAnimation: false, // 设置饼图默认的展开样式
  //       label: {
  //         show: false,
  //         normal: {
  //           show: false,
  //           position: 'center'
  //         },

  //       },
  //       labelLine: {
  //         normal: {
  //           show: false
  //         }
  //       },

  //       itemStyle: { // 此配置
  //         emphasis: {
  //           borderWidth: 0,
  //           shadowBlur: 2,
  //           shadowOffsetX: 0,
  //           shadowColor: 'rgba(0, 0, 0, 0.5)'
  //         }
  //       },
  //       data: that.arr[2]
  //     }
  //     ]
  //   }));
  ngOnChanges(changes: SimpleChanges) {
  }
}
