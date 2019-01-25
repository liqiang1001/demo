import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from 'src/app/core/cache/cache.service';
import { DictService } from 'src/app/core/dict/dict.service';
import { StatisticsService } from '../statistics.service';
import { DefaultService } from 'src/app/layout/default/default.service';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-net-work-lending-info',
  templateUrl: './net-work-lending-info.component.html',
  styleUrls: ['./net-work-lending-info.component.less']
})
export class NetWorkLendingInfoComponent implements OnInit {
  searchForm: FormGroup;
  searchParams = [];
  sortTypeList: any;  // 排序列表
  multipleList = [];  // 时间列表
  // 搜索表格
  pageIndex = 1;
  pageSize = 10;
  displayData = [];
  isloading = false;
  total: any;
  // 表格
  tabList = [
    '序号', '企业名称', '	时间', '平台名称', '累计交易总额', '累计交易总笔数', '累计借款人数量', '累计出借人数量',
    '平均借款额度', '平均借款期限（天）', '平均投资额度', '平均投资期限（月）',
    '借贷余额', '平均借款成本', '平均投资回报', '平均满标用时（小时）',
    '前十大借款人待还金额占比', '最大单一借款人借款金额占比', '关联关系借款余额',
    '存管余额 （万元）', '线下交易总额（万元）', '尚未结清的借款人数', '尚未收回借款的出借人数（万人）'
  ]; // 表头
  tableList: any;
  menuList = [
    { id: 72, name: '导出', show: false },
  ];
  isLoadingTwo = false;
  constructor(private message: NzMessageService,
    private fb: FormBuilder, private cache: CacheService,
    private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute,
    private http: StatisticsService, private dict: DictService) { }

  ngOnInit() {
    this.getMenuAccess();
    this.sortTypeList = this.dict.get('CreditPlatformInfo');
    console.log(this.sortTypeList);
    this.getDateList();
    this.searchForm = this.fb.group({
      entName: [''], //  公司名称
      minRelationBorrowBalance: [''],	// 关联关系借款余额（开始）
      maxRelationBorrowBalance: [''],	// 关联关系借款余额（结束）
      minAverageBorrowDeadline: [''],	// 平均借款期限（开始）
      maxAverageBorrowDeadline: [''],	// 平均借款期限（结束）
      minAverageInvestLimit: [''],	// 平均投资额度（开始）
      maxAverageInvestLimit: [''],	// 平均投资额度（结束）
      minBorrowBalance: [''],	// 借贷余额（开始）
      maxBorrowBalance: [''],	// 借贷余额（结束）
      minExchangeCount: [''],	// 累计交易总额(开始）
      maxExchangeCount: [''],	// 累计交易总额（结束）
      minAverageInvestReturn: [''],	// 平均投资回报(开始）
      maxAverageInvestReturn: [''],	// 平均投资回报（结束）
      mindepositBalance: [''],	// 存管余额(开始）
      maxdepositBalance: [''],	// 存管余额（结束）
      minOfflineExchangeCount: [''],	// 线下交易总额(开始）
      maxOfflineExchangeCount: [''],	// 线下交易总额（结束）
      minAverageBorrowCost: [''],	// 平均借款成本（开始）
      maxAverageBorrowCost: [''],	// 平均借款成本（结束）
      minAverageBorrowCount: [''],	// 平均借款额（开始）
      maxAverageBorrowCount: [''],	// 平均借款额（结束）
      sortType: [''],
      batchDateList: [],
      platform: [],
    });
    this.getDataList(this.searchForm.value);
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
    this.searchForm.reset();
  }
  // 导出文件
  outFile(params) {
    const list = {
      reportMinDate: '',  // 填报开始时间
      reportMaxDate: '',  // 填报结束时间
      userId: this.cache.get('userId'),
      ...params
    };
    this.http.exportFile(list, 'CreditPlatformExport', '网络借贷平台运营总体情况数据列表.xlsx');
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
  // 获取表格数据
  getDataList: any = (params) => {
    this.getDataList.isLoading = true;
    const list = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      reportMinDate: '',  // 填报开始时间
      reportMaxDate: '',  // 填报结束时间
      userId: this.cache.get('userId'),
      ...params
    };
    this.http.getCreditPlatform(list).subscribe((res: any) => {
      this.getDataList.isLoading = false;
      this.total = res.pageTotal;
      this.tableList = res.returnList;
    });
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
  changeData(item, num) {
    return Number(item).toFixed(num);
  }
  changeNum(timeVal, val, num) {
    let vals = 0;
    const times = new Date('2018-04-01 00:00:00').getTime();
    if (timeVal < times) {
      vals = val * 24;
    } else {
      vals = val;
    }
    return Number(vals).toFixed(num);
  }

}
