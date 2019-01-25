import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from '../../../../core/cache/cache.service';
import { DictService } from '../../../../core/dict/dict.service';
import { ManagerService } from '../manager.service';
import { AddCompanyUserComponent } from './add-company-user/add-company-user.component';
import { EditCompanyUserComponent } from './edit-company-user/edit-company-user.component';
import { NzModalService } from 'ng-zorro-antd';
import { PassportService } from 'src/app/routes/passport/passport.service';
import { SaveService } from 'src/app/core/save/save.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';
import { ResetModalComponent } from './reset-modal/reset-modal.component';



@Component({
  selector: 'app-company-user-management',
  templateUrl: './company-user-management.component.html',
  styleUrls: ['./company-user-management.component.less']
})
export class CompanyUserManagementComponent implements OnInit {
  // 搜索表格
  searchForm: FormGroup;
  searchParams = [];
  provinces: any;
  citys: any;
  districts: any;
  sourceList: any;
  pageIndex = 1;
  pageSize = 10;
  total: any;
  indeterminate = false;
  displayData = [];
  allChecked = false;
  isloading: boolean;
  data = [];
  // 修改手机号/
  // 弹框
  NzModalService: any;
  addFlag: boolean;
  provinceIdFlag: boolean;
  userData: any;
  configId;
  districtIdFlag: boolean;
  cityIdFlag: boolean;
  configIdFlag: boolean;
  enterpriseTypeList: any;
  menuList = [
    { id: 45, name: '添加企业用户', show: false },
    { id: 46, name: '批量添加用户', show: true },
    { id: 48, name: '修改', show: true },
    { id: 49, name: '重置密码', show: true },
    { id: 50, name: '重置手机', show: true },
    { id: 51, name: '启用/禁用', show: true },
  ];
  constructor(private message: NzMessageService,
    private fb: FormBuilder, private cache: CacheService,
    private modalService: NzModalService,
    private seve: SaveService,
    private activeRoute: ActivatedRoute,
    private menuHttp: DefaultService,
    private http: ManagerService, private dict: DictService) { }
  ngOnInit() {
    this.getMenuAccess();
    console.log(this.cache.get('userData'));
    this.userData = this.cache.get('userData');
    this.configId = this.cache.get('userData').configId;
    this.configIdFlag = this.cache.get('userData').configId ? true : false;
    console.log(this.configId);
    let provinceId;
    let cityId;
    let districtId;
    if (this.configIdFlag) {
      if (this.userData.provinceId) {
        provinceId = this.userData.provinceId;
        this.getCitys(provinceId);
        this.provinceIdFlag = true;
      }
      if (this.userData.cityId) {
        cityId = this.userData.cityId;
        this.getDistricts(cityId);
        this.cityIdFlag = true;
      }
      if (this.userData.districtId) {
        districtId = this.userData.districtId;
        this.districtIdFlag = true;
      }
    }
    this.getProvince();
    this.sourceList = this.dict.get('source');
    this.dict.get('userType');
    this.dict.get('system_view');
    this.searchForm = this.fb.group({
      companyName: [''],
      userName: [''],
      source: [''],
      provinceCode: provinceId ? provinceId : [''],
      cityCode: cityId ? cityId : [''],
      countyCode: districtId ? districtId : [''],
      enterpriseType: [],
      platform: []
    });
    this.getCompanyList(this.searchForm.value);
    this.getenterType();
  }
  // 判断按钮权限
  getMenuAccess() {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.menuHttp.getMenuAccess(params.littleId).subscribe((res: any) => {
        const list = [];
        if (res) {
          res.forEach(element => {
            list.push(element.id);
          });
          for (let i = 0; i < list.length; i++) {
            this.menuList.filter((item => {
              item.show = list.indexOf(item.id) > -1;
            }));
          }
        }
      });
    });
  }
  // 下载模板
  downLoadTemp() {
    this.http.downLoadEntTemp().subscribe((res: any) => {
      this.seve.saveExcel(res);
    });
  }
  // 批量导入用户
  click_fileUp = (item) => {
    this.http.entFileUpload(item).subscribe(res => {
      this.message.success('导入成功');
    });
  }
  // 获取企业类型
  getenterType() {
    this.http.getenterType(this.cache.get('userId')).subscribe((res: any) => {
      this.enterpriseTypeList = res;
    });
  }
  // 获取省
  getProvince() {
    this.http.getProvincesData().subscribe(res => {
      this.provinces = res;
    });
  }
  // 获取市
  getCitys(e) {
    if (e) {
      this.http.getCitys(e).subscribe(res => {
        this.citys = res;
      });
    }
  }
  // 获取区
  getDistricts(e) {
    if (e) {
      this.http.getDistricts(e).subscribe(res => {
        this.districts = res;
      });
    }
  }
  // 获取企业列表数据
  getCompanyList(params) {
    const paramsList: any = {
      id: this.cache.get('userId'),
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      loginName: params.userName,
      enterpriseName: params.companyName,
      cityId: params.cityCode,
      districtId: params.countyCode,
      provinceId: params.provinceCode,
      sourceId: params.source,
      typeIds: params.enterpriseType ? params.enterpriseType : '',
      platform: params.platform
    };
    this.isloading = true;
    this.http.getCompanyList(paramsList).subscribe((res: any) => {
      this.isloading = false;
      this.data = res.userList;
      this.total = res.pageTotal;
    });
  }
  // 刷新状态
  refreshStatus(e): void {
    if (e) {
      this.pageIndex = e;
      this.getCompanyList(this.searchForm.value);
    }
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }
  // 全选
  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus('');
  }
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus('');
  }
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  // 禁用/启用
  publishJob(e): void {
    this.modalService.confirm({
      nzTitle: '确定执行该操作?',
      nzOnOk: () => {
        if (e.id) {
          if (e.status === '0') {
            this.http.disable(e.id).subscribe(res => {
              this.message.success('禁用用户成功');
              this.getCompanyList(this.searchForm.value);
            });
          } else {
            this.http.enable(e.id).subscribe(res => {
              this.message.success('启用用户成功');
              this.getCompanyList(this.searchForm.value);
            });
          }
        }
      }
    });
  }
  // 重置密码、手机号
  creatPass(item, flag) {
    let component;
    let title;
    if (flag) {
      title = '密码修改';
    } else {
      title = '修改手机号';
    }
    component = ResetModalComponent;
    const modal = this.modalService.create({
      nzWidth: 700,
      nzTitle: title,
      nzContent: component,
      nzFooter: null,
      nzComponentParams: {
        item: item,
        flag: flag,
        gov: false
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getCompanyList(this.searchForm.value);
      }
    });
  }

  // 添加或编辑用户模态框组件
  showModalForComponent(item) {
    let component;
    let title;
    if (item) {
      component = EditCompanyUserComponent;
      title = '编辑企业用户';
    } else {
      component = AddCompanyUserComponent;
      title = '添加企业用户';
    }
    const modal = this.modalService.create({
      nzWidth: 700,
      nzTitle: title,
      nzContent: component,
      nzFooter: null,
      nzComponentParams: {
        item: item,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getCompanyList(this.searchForm.value);
      }
    });
  }
}
