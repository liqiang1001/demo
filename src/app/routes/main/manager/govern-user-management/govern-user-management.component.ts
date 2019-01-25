import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '../../../../core/cache/cache.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ManagerService } from '../manager.service';
import { DictService } from '../../../../core/dict/dict.service';
import { EditGovernUserComponent } from './edit-govern-user/edit-govern-user.component';
import { AddGovernUserComponent } from './add-govern-user/add-govern-user.component';
import { PassportService } from 'src/app/routes/passport/passport.service';
import { SaveService } from 'src/app/core/save/save.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';
import { ResetModalComponent } from '../company-user-management/reset-modal/reset-modal.component';

@Component({
  selector: 'app-govern-user-management',
  templateUrl: './govern-user-management.component.html',
  styleUrls: ['./govern-user-management.component.less']
})

export class GovernUserManagementComponent implements OnInit {
  @ViewChild('PhoneInput') PhoneInput;
  @ViewChild('PassInput') PassInput;
  // 搜索表格
  userId;
  configId;
  configIdFlag: boolean;
  searchForm: FormGroup;
  searchParams = [];
  provinces: any;
  citys: any;
  districts: any;
  roleList: any;
  pageIndex = 1;
  pageSize = 10;
  total: any;
  indeterminate = false;
  displayData = [];
  allChecked = false;
  isloading: boolean;
  data = [];
  // 弹框
  provinceIdFlag: boolean;
  userData: any;
  districtIdFlag: boolean;
  cityIdFlag: boolean;
  phoneConfigId = null;
  NzModalService: any;
  menuList = [
    { id: 53, name: '添加政府用户', show: false },
    { id: 54, name: '批量添加用户', show: true },
    { id: 56, name: '修改', show: true },
    { id: 57, name: '重置密码', show: true },
    { id: 58, name: '重置手机', show: true },
    { id: 59, name: '启用/禁用', show: true },
  ];
  constructor(private message: NzMessageService,
    private fb: FormBuilder, private cache: CacheService,
    private modalService: NzModalService,
    private save: SaveService,
    private activeRoute: ActivatedRoute,
    private menuHttp: DefaultService,
    private passportHttp: PassportService,
    private http: ManagerService, private dict: DictService) { }
  ngOnInit() {
    this.getMenuAccess();
    this.userData = this.cache.get('userData');
    this.configId = this.cache.get('userData').configId;
    this.configIdFlag = this.cache.get('userData').configId ? true : false;
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
    this.getRoleListByType();
    this.dict.get('userType');
    this.dict.get('source');
    this.dict.get('system_view');
    this.searchForm = this.fb.group({
      name: [''],
      userName: [''],
      provinceCode: provinceId ? provinceId : [''],
      cityCode: cityId ? cityId : [''],
      countyCode: districtId ? districtId : [''],
      role: [''],
    });
    this.getGovernList(this.searchForm.value);
    this.userId = this.cache.get('userId');
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
              item.show = list.indexOf(item.id) > -1;
            }));
          }
        }
      });
    });
  }
  // 下载模板
  downLoadTemp() {
    this.http.downLoadGovTemp().subscribe((res: any) => {
      this.save.saveExcel(res);
    });
  }
  // 批量导入用户
  click_fileUp = (item) => {
    this.http.govFileUpload(item).subscribe(res => {
      this.message.success('导入成功');
    });
  }
  // 角色名称
  getRoleListByType() {
    const ids = this.configIdFlag ? this.userData.roleIds.split(',') : null;
    this.http.getRoleListByType('2', ids).subscribe((res: any) => {
      this.roleList = res;
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
  // 获取列表
  getGovernList(params) {
    const paramsList: any = {
      id: this.cache.get('userId'),
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      loginName: params.userName,
      name: params.name,
      cityId: params.cityCode,
      districtId: params.countyCode,
      provinceId: params.provinceCode,
      roleIds: params.role,
    };
    this.isloading = true;
    this.http.getGovernList(paramsList).subscribe((res: any) => {
      this.isloading = false;
      this.data = res.userList;
      this.total = res.pageTotal;
    });
  }
  // 分页刷新状态
  refreshStatus(e): void {
    if (e) {
      this.pageIndex = e;
      this.getGovernList(this.searchForm.value);
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
              this.getGovernList(this.searchForm.value);
            });
          } else {
            this.http.enable(e.id).subscribe(res => {
              this.message.success('启用用户成功');
              this.getGovernList(this.searchForm.value);
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
        gov: true
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getGovernList(this.searchForm.value);
      }
    });
  }
  // 添加或编辑用户模态框组件
  showModalForComponent(item) {
    let component;
    let title;
    if (item) {
      component = EditGovernUserComponent;
      title = '编辑政府用户';
    } else {
      component = AddGovernUserComponent;
      title = '添加政府用户';
    }
    const modal = this.modalService.create({
      nzWidth: 800,
      nzTitle: title,
      nzContent: component,
      nzFooter: null,
      nzComponentParams: {
        item: item,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getGovernList(this.searchForm.value);
      }
    });
  }
}
