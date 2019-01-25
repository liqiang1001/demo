import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from 'src/app/core/cache/cache.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DictService } from 'src/app/core/dict/dict.service';
import { StatisticsService } from '../statistics.service';
import { OnsiteService } from '../../onsite/onsite.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';

@Component({
  selector: 'app-progress-of-rectification',
  templateUrl: './progress-of-rectification.component.html',
  styleUrls: ['./progress-of-rectification.component.less']
})
export class ProgressOfRectificationComponent implements OnInit {
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
  tabList = ['编号', '公司名称', '工作进展', '存量不合规业务计划退出时间', '整改以来存量规模变化（万元）', '整改以来存量不合规业务规模变化（万元）', '操作'];
  tableList: any;
  menuList = [
    { id: 64, name: '导出', show: false },
    { id: 65, name: '详情', show: false },
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
      batchDate: [''],
      enterpriseName: [''],
      registrationNumber: [''],
      provinceId: [''],
      cityId: [''],
      districtId: [''],
      enterpriseType: [],
      source: [''],
    });
    this.getDataList(this.searchForm.value);
    this.searchForm.patchValue({
      batchDate: this.defaultDate(true)
    });
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
  goDetail(data) {
    this.cache.set('rectificationDetail', data);
    this.router.navigate(['./detail'], { relativeTo: this.activeRoute });
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
    params.batchDate = this.http.showtime(params.batchDate, '1');
    console.log(params);
    const list = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      userId: this.cache.get('userId'),
      ...params
    };
    this.isloading = true;
    this.http.getrectifyMonitor(list).subscribe((res: any) => {
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
    if (!params.enterpriseType) {
      params.enterpriseType = [];
    }
    params.batchDate = this.http.showtime(params.batchDate, '1');
    const list = {
      userId: this.cache.get('userId'),
      enterpriseType: params.enterpriseType,
      batchDate: params.batchDate
    };
    this.http.exportFile(list, 'rectifyMonitorExport', '整改明细数据列表');
  }
  defaultDate(i) {   // 根据时间，设置默认http请求的时间数据
    const da = new Date();
    const year = da.getFullYear();
    const month = da.getMonth() + 1;
    if (i) {
      return da;
    } else {
      return year + '-' + month;
    }
  }
}
