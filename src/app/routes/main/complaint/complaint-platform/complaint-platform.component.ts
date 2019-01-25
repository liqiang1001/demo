import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CacheService } from 'src/app/core/cache/cache.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OnsiteService } from '../../onsite/onsite.service';
import { ComplaintService } from '../complaint.service';
import { DictService } from 'src/app/core/dict/dict.service';
import { format } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd';
import { SaveService } from 'src/app/core/save/save.service';
import { environment } from '../../../../../environments/environment';
import { DefaultService } from 'src/app/layout/default/default.service';



@Component({
  selector: 'app-complaint-platform',
  templateUrl: './complaint-platform.component.html',
  styleUrls: ['./complaint-platform.component.less']
})
export class ComplaintPlatformComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  url = environment.SERVER_URL + '/wechatservice/complaintReport/exportReportInfo';
  searchParams = [];
  statusList = [
    {
      id: 0,
      name: '未处理'
    },
    {
      id: 1,
      name: '已答复'
    }
  ];  // 处理状态
  reportRoleList: any;
  reportReasonList: any;
  districts: any;
  citys: any;
  provinces: any;
  // 表格
  displayData: any;
  pageIndex = 1;
  pageSize = 10;
  total: any;
  isloading: boolean;
  tableList: any;
  isImage: boolean;
  time: any;
  menuList = [
    { id: 0, name: '批量审批', show: false },
    { id: 1, name: '详情', show: false },
  ];
  constructor(private fb: FormBuilder,
    private cache: CacheService,
    public router: Router,
    private areaHttp: OnsiteService,
    private activeRoute: ActivatedRoute,
    private dict: DictService,
    private menuHttp: DefaultService,
    private http: ComplaintService,
    private message: NzMessageService,
    private save: SaveService
  ) { }

  ngOnInit() {
    this.time = setInterval(() => {
      this.reportReasonList = this.dict._get('report_reason');
      this.reportRoleList = this.dict._get('report_role');
      this.dict._get('feedback_demo');
      if (!!this.reportReasonList && !!this.reportRoleList) {
        clearInterval(this.time);
      }
    }, 500);
    this.searchForm = this.fb.group({
      enterpriseName: [],
      platformName: [],
      status: [],
      chuliTime: [],
      provinceId: [],
      cityId: [],
      districtId: [],
      reportRole: [],  //  举报人角色
      reportReason: [],  //  举报原因
      pass: [''],
      dataRange: [],
      phone: [''],
      reportName: ['']
    });
    this.getProvince();
    this.getDataList(this.searchForm.value, false);
  }
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
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
            list.push(element.name);
          });
          for (let i = 0; i < list.length; i++) {
            this.menuList.filter((item => {
              if (list.indexOf(item.name) > -1) {
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
  // 导出文件
  outFile(params) {
    if (params.dataRange) {
      if (!params.dataRange[0]) {
        this.message.error('请选择开始时间');
        return;
      }
      if (!params.dataRange[1]) {
        this.message.error('请选择结束时间');
        return;
      }
      this.isImage = true;
    } else {
      this.message.error('请选择开始时间');
      return;
    }
  }

  getDataList(params, flag) {
    console.log(params);
    if (flag) {
      // tslint:disable-next-line:forin
      for (const key in params) {
        if (params[key]) {
          this.pageIndex = 1;
        }
      }
    }
    let cityid;
    let provinceId;
    let districtId;
    if (params.cityId) {
      // if (params.cityId.name === '北京市') {
      //   cityid = '北京城区';
      // } else {
      cityid = params.cityId.name;
      // }
    }
    if (params.provinceId) {
      provinceId = params.provinceId.name;
    }
    if (params.districtId) {
      districtId = params.districtId.name;
    }
    if (params.reportReason) {
      params.reportReason = params.reportReason;
    }
    const list = {
      userId: this.cache.get('userId'),
      userName: params.reportName,
      userPhone: params.phone,
      platformName: params.platformName,
      companyName: params.enterpriseName,
      reasons: params.reportReason,
      role: params.reportRole,
      status: params.status,
      searchStart: params.dataRange ? this.parserDate(format(params.dataRange[0], 'YYYY-MM-DD 00:00:00')) : null,
      provinceId: provinceId,
      cityId: cityid,
      countyId: districtId,
      searchEnd: params.dataRange ? this.parserDate(format(params.dataRange[1], 'YYYY-MM-DD 23:59:59')) : null,
      feedBackDate: params.chuliTime,
      page: this.pageIndex,
      pageSize: this.pageSize
    };
    this.isloading = true;
    this.http.getFormList(list).subscribe((res: any) => {
      if (res.body) {
        this.isloading = false;
        this.total = res.body.total;
        this.tableList = res.body.list;
      }
    });
  }
  goDetail(e, index) {
    this.cache.set('txList', e);
    this.router.navigate(['./detail'], { relativeTo: this.activeRoute, queryParams: { id: index } });
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
      this.areaHttp.getCitys(e.id).subscribe(res => {
        this.citys = res;
      });
    }
  }
  // 获取区
  getDistricts(e) {
    if (e) {
      this.areaHttp.getDistricts(e.id).subscribe(res => {
        this.districts = res;
      });
    }
  }

  // 分页
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
  }
  refreshStatus(e) {
    if (e) {
      this.pageIndex = e;
      this.getDataList(this.searchForm.value, false);
    }
  }

  parserDate(date) {
    const t = Date.parse(date);
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, '/')));
    } else {
      return new Date();
    }
  }
  handleOk(params) {
    if (!params.pass) {
      this.message.error('请填写密钥口令');
      return;
    }
    this.isImage = false;
    let cityid;
    let provinceId;
    let districtId;
    if (params.cityId) {
      // if (params.cityId.name === '北京市') {
      // cityid = '北京城区';
      // } else {
      cityid = params.cityId.name;
      // }
    }
    if (params.provinceId) {
      provinceId = params.provinceId.name;
    }
    if (params.districtId) {
      districtId = params.districtId.name;
    }
    if (params.reportReason) {
      params.reportReason = params.reportReason;
    }

    const list = {
      platformName: params.platformName,
      companyName: params.enterpriseName,
      reasons: params.reportReason,
      role: params.reportRole,
      status: params.status,
      searchStart: params.dataRange ? this.parserDate(format(params.dataRange[0], 'YYYY-MM-DD 00:00:00')) : null,
      provinceId: provinceId,
      cityId: cityid,
      countyId: districtId,
      searchEnd: params.dataRange ? this.parserDate(format(params.dataRange[1], 'YYYY-MM-DD 23:59:59')) : null,
      feedBackDate: params.chuliTime,
      page: this.pageIndex,
      pageSize: this.pageSize,
      upDownloadPwd: params.pass,
    };
    this.searchForm.patchValue({ 'datas': JSON.stringify(list) });

    this.http.save(list).subscribe((res: any) => {
      this.save.saveExcel(res);
    });

  }
  handleCancel() {
    this.isImage = false;
  }
  ngOnDestroy() {
    clearInterval(this.time);
  }

}
