import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from 'src/app/core/cache/cache.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DictService } from 'src/app/core/dict/dict.service';
import { StatisticsService } from '../statistics.service';
import { OnsiteService } from '../../onsite/onsite.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';

@Component({
  selector: 'app-mobility-monitored',
  templateUrl: './mobility-monitored.component.html',
  styleUrls: ['./mobility-monitored.component.less']
})
export class MobilityMonitoredComponent implements OnInit {
  monthFormat = 'yyyy-MM';
  searchForm: FormGroup;
  searchParams = [];
  // 搜索表格
  provinces: any;
  citys: any;
  districts: any;
  pageIndex = 1;
  pageSize = 10;
  sourceNames: any;
  displayData = [];
  isloading = false;
  total: any;
  conpanyNameData: any;
  optionArr = [{ name: '是', id: '1' }, { name: '否', id: '0' }];
  tabList = ['序号', '企业名称', '是否整改通知书', '平台名称', '资产端应收回金额', '资产端应兑付金额', '风险阈值', '操作'];
  tableList: any;
  menuList = [
    { id: 67, name: '导出', show: false },
    { id: 153, name: '详情', show: false },
  ];
  constructor(private nzMessageService: NzMessageService,
    private fb: FormBuilder, private cache: CacheService,
    private areaHttp: OnsiteService,
    public router: Router,
    private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute,
    private http: StatisticsService, private dict: DictService) { }
  ngOnInit() {
    this.getMenuAccess();
    this.sourceNames = this.dict.get('source');
    this.getProvince();
    this.http.getRoleType().subscribe(res => {
      this.conpanyNameData = res;
    });
    this.searchForm = this.fb.group({
      enterpriseName: [''],
      isRectifyInform: [''],
      provinceId: [''],
      cityId: [''],
      districtId: [''],
      enterpriseType: [],
      source: [''],
      maxTime: [''],
      minTime: [''],
      numberMax: [''],
      numberMix: [''],
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
          if (!this.menuList[1].show) {
            this.tabList.pop();
          }
        }

      });
    });
  }
  // 分页
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
  }
  refreshStatus(e) {
    if (e) {
      this.pageIndex = e;
      this.getDataList(this.searchForm.value);
    }
  }
  goDetail(id, index) {
    this.router.navigate(['./detail'], { relativeTo: this.activeRoute, queryParams: { id: id, index: index } });
  }
  // 获取省
  getProvince() {
    this.areaHttp.getProvincesData().subscribe(res => {
      this.provinces = res;
    });
  }
  // 获取市
  getCitys(e) {
    if (e) {
      this.areaHttp.getCitys(e).subscribe(res => {
        this.citys = res;
      });
    }
  }
  // 获取区
  getDistricts(e) {
    if (e) {
      this.areaHttp.getDistricts(e).subscribe(res => {
        this.districts = res;
      });
    }
  }
  // 获取表格数据
  getDataList(params) {
    params.minTime = this.http.showtime(params.minTime);
    params.maxTime = this.http.showtime(params.maxTime);
    console.log(params);
    const list = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      userId: this.cache.get('userId'),
      ...params
    };
    this.isloading = true;
    this.http.getGap(list).subscribe((res: any) => {
      console.log(res);
      this.isloading = false;
      this.total = res.pageTotal;
      this.tableList = res.returnList;
    });
  }
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  // 导出文件
  outFile(params) {
    const list = {
      userId: this.cache.get('userId'),
      ...params
    };
    this.http.exportFile(list, 'findGapExport', '流动性缺口检测统计数据列表');
  }

}
