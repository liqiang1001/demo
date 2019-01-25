import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from 'src/app/core/cache/cache.service';
import { DictService } from 'src/app/core/dict/dict.service';
import { StatisticsService } from '../statistics.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DefaultService } from 'src/app/layout/default/default.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-day-message-send-info',
  templateUrl: './day-message-send-info.component.html',
  styleUrls: ['./day-message-send-info.component.less']
})
export class DayMessageSendInfoComponent implements OnInit {
  searchForm: FormGroup;
  searchParams = [];
  batchTypeList: any;  // 排序列表
  multipleList = [];  // 时间列表
  // 搜索表格
  pageIndex = 1;
  pageIndex2 = 1;
  pageSize = 10;
  displayData = [];
  isloading = false;
  displayData2 = [];
  isloading2 = false;
  total: any;
  total2: any;
  // 表格
  tabList = [{ name: '序号', tabname: 'index', isPos: false, left: '' },
  { name: '企业名称', tabname: 'entName', isPos: false, left: '' },
  { name: '	统计时间', tabname: 'batchBeginDate', isPos: false, left: '' },
  { name: '平台名称', tabname: 'platform', isPos: false, left: '' },
  { name: '整改通知书批次', tabname: 'batchName', isPos: false, left: '' },
  { name: '借贷余额（万元）', tabname: 'opt_info_02', isPos: false, left: '' },
  { name: '存量不合规余额（万元）', tabname: 'opt_info_03', isPos: false, left: '' },
  { name: '利息余额（万元）', tabname: 'opt_info_05', isPos: false, left: '' },
  { name: '存量不合规利息余额（万元）', tabname: 'opt_info_06', isPos: false, left: '' },
  { name: '当前借款人数量', tabname: 'opt_info_09', isPos: false, left: '' },
  { name: '当前出借人数量', tabname: 'opt_info_10', isPos: false, left: '' },
  { name: '人均借款期限(天)', tabname: 'opt_info_29', isPos: false, left: '' },
  { name: '自然人平均借款额度（万元）', tabname: 'opt_info_35', isPos: false, left: '' },
  { name: '法人及其他组织平均借款额度（万元）', tabname: 'opt_info_36', isPos: false, left: '' },
  { name: '平均借款利率（%）', tabname: 'opt_info_37', isPos: false, left: '' },
  { name: '逾期金额（万元）', tabname: 'opt_info_15', isPos: false, left: '' },
  { name: '逾期90天（不含）以上金额（万元）', tabname: 'opt_info_17', isPos: false, left: '' },
  { name: '金额逾期率（%）', tabname: 'opt_info_20', isPos: false, left: '' },
  { name: '逾期90天（不含）以上逾期率（%）', tabname: 'opt_info_45', isPos: false, left: '' },
  { name: '机构规模分布情况', tabname: 'opt_info_38', isPos: false, left: '' },
  { name: '是否与银行签订资金存管协议', tabname: 'bank_01', isPos: false, left: '' },
  { name: '签约存管银行名称', tabname: 'bank_02', isPos: false, left: '' },
  { name: '签约存管银行是否在京设有经营实体', tabname: 'bank_03', isPos: false, left: '' },
  { name: '是否上线资金存管', tabname: 'bank_04', isPos: false, left: '' }];
  // 表头
  tableList: any;
  entId: any;
  entType: any;
  entName: any;
  batchName: any;
  isVisible = false;
  tableList2: any;
  menuList = [
    { id: 70, name: '导出', show: false },
  ];

  constructor(private nzMessageService: NzMessageService,
    private fb: FormBuilder, private cache: CacheService,
    private domSanitizer: DomSanitizer,
    private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute,
    private http: StatisticsService, private dict: DictService) { }

  ngOnInit() {
    this.tabList = this.tabList.map(i => {
      return {
        ...i,
        width: i.name.length + 2
      };
    });
    console.log(this.tabList);
    this.getMenuAccess();
    this.batchTypeList = this.dict.get('enterprise_batch');
    this.getDateList();
    this.searchForm = this.fb.group({
      enterpriseName: null, //  公司名称
      batch: null,
      batchDateList: [],
      platform: [],

    });
    this.getDataList(this.searchForm.value);
  }
  posCol(arr, i) {
    console.log(arr, i);
    let left = 0;
    arr[i].isPos = !arr[i].isPos;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element.isPos) {
        element.left = left + 'em';
        left += element.width;
      }
    }
    // arr.forEach((element, index) => {
    //   if (index < i && element.isPos) {
    //     left += element.width;
    //   }
    // });
    // arr[i].left = left + 'em';
  }
  // 判断按钮权限
  getMenuAccess() {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      console.log(params.littleId);
      this.menuHttp.getMenuAccess(params.littleId).subscribe((res: any) => {
        console.log(res);
        const list = [];
        if (res) {
          res.forEach(element => {
            list.push(element.id);
          });
          for (let i = 0; i < list.length; i++) {
            this.menuList.filter((item => {
              if (list.indexOf(item.id) > -1) {
                item.show = true;
              } else {
                item.show = false;
              }
            }));
          }
        }

      });
    });
  }
  // 重置搜索列表
  resetForm(): void {
    console.log(this.searchForm.value);
    this.searchForm.reset();
    console.log(this.searchForm.value);

  }
  // 导出文件
  outFile(params) {
    const list = {
      userId: this.cache.get('userId'),
      ...params
    };
    this.http.exportFile(list, 'everyDayMsgExport', '日常信息报送总体情况数据列表');
  }
  // 获取时间列表
  getDateList() {
    this.http.getDateList().subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        this.multipleList.push({ 'val': res[i], 'label': this.timesZh(res[i]).toString() });
      }
      this.multipleList = this.multipleList.reverse();
    });
  }
  // 数字每隔3个加一个“，”

  returnData(isShow, num) {
    let numbers;
    if (isShow) {
      numbers = this.domSanitizer.bypassSecurityTrustHtml('<span style="color:red;font-size: 16px;">X</span>');
    } else {
      numbers = num;
    }
    return numbers;
  }
  // 获取表格数据
  getDataList(params) {
    console.log(params);
    const list = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      userId: this.cache.get('userId'),
      ...params
    };
    this.isloading = true;
    this.http.getEveryDayMsg(list).subscribe((res: any) => {
      console.log(res);
      this.isloading = false;
      this.total = res.pageTotal;
      this.tableList = res.dataList;
    });
  }
  // 查询单个企业数
  selectedTable(item) {
    this.isVisible = true;
    console.log(item);
    this.entType = item.entType;
    this.batchName = item.batchName;
    this.entId = item.entId;
    this.entName = item.entName;
    this.getDataList2();
  }
  getDataList2() {
    const list = {
      pageNumber: this.pageIndex2,
      pageSize: this.pageSize,
      userId: this.cache.get('userId'),
      entId: this.entId
    };
    this.http.getEveryDayMsg(list).subscribe((res: any) => {
      console.log(res);
      this.total2 = res.pageTotal;
      this.tableList2 = res.dataList;
    });
  }
  export() {
    const list = {
      userId: this.cache.get('userId'),
      entId: this.entId
    };
    this.http.exportFile(list, 'everyDayMsgExport', '日常信息报送总体情况数据列表');
  }
  handleOk() {
    this.isVisible = false;
  }
  handleCancel() {
    this.isVisible = false;
  }
  // 重置搜索列表
  // 时间处理
  timesZh(time) {
    const date = new Date(time);
    const Y = date.getFullYear() + '年';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    const D = date.getDate() + '日';
    return Y + M + D;
  }
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
  }
  refreshStatus(e) {
    if (e) {
      this.pageIndex = e;
      this.getDataList(this.searchForm.value);
    }
  }
  currentPageDataChange2($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData2 = $event;
  }
  refreshStatus2(e) {
    if (e) {
      this.pageIndex2 = e;
      this.getDataList2();
    }
  }
  // 日常信息报送总体情况数据列表
}
