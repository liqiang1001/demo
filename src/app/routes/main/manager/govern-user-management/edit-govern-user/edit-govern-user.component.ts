import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CacheService } from '../../../../../core/cache/cache.service';
import { ManagerService } from '../../manager.service';
import { DictService } from '../../../../../core/dict/dict.service';
import { PassportService } from 'src/app/routes/passport/passport.service';

@Component({
  selector: 'app-edit-govern-user',
  templateUrl: './edit-govern-user.component.html',
  styleUrls: ['./edit-govern-user.component.less']
})
export class EditGovernUserComponent implements OnInit {
  editForm: FormGroup;
  editParams = [];
  roleList: any; // 角色列表
  provinces: any;
  citys: any;
  districts: any;
  roadIds: any;
  sourceList: any;
  enterpriseTypeList: any; // 企业类型列表
  TypeList = [];
  systemCanSeeList: any;  // 系统可见
  agencyList = [];  // 机构
  orgName = [];
  originalData: any; // 原始数据
  loadData: any;
  indeterminate = false;
  id: any;
  configId: any;
  provinceIdFlag: boolean;
  districtIdFlag: boolean;
  cityIdFlag: boolean;
  roadIdFlag: boolean;
  configIdFlag: boolean;
  userData: any;

  constructor(private message: NzMessageService,
    private fb: FormBuilder, private cache: CacheService,
    private model: NzModalRef, private reg: PassportService,
    private http: ManagerService, private dict: DictService) { }

  ngOnInit() {
    this.configId = this.cache.get('userData').configId;
    this.userData = this.cache.get('userData');
    this.configIdFlag = this.configId ? true : false;
    if (this.configIdFlag) {
      if (this.userData.provinceId) {
        this.provinceIdFlag = true;
      }
      if (this.userData.cityId) {
        this.cityIdFlag = true;
      }
      if (this.userData.districtId) {
        this.districtIdFlag = true;
      }
      if (this.userData.roadId) {
        this.roadIdFlag = true;
      }
    }
    this.editForm = this.fb.group({
      loginName: ['', Validators.required],
      provinceId: ['', Validators.required],
      cityId: ['', Validators.required],
      districtId: [''],
      roadId: [''],
      roleIds: ['', Validators.required], // 角色名称
      name: ['', Validators.required], // 姓名
      email: ['', Validators.required],
      job: ['', Validators.required],
      typeIds: ['', Validators.required],
      orgIds: ['', Validators.required],
      jsmc: [''],
      allChecked: false,
      phoneCode: [''],
      userRecordSee: 0
    });
    this.getUserInfo(this.model.getContentComponent().item);
    this.sourceList = this.dict.get('source');
    this.systemCanSeeList = this.dict.get('system_view');
    this.enterpriseTypeList = this.dict.get('userType');
    this.getRoleListByType();
    this.getProvince();
    this.getAgency('');
    this.enterpriseTypeList.forEach(element => {
      element.checked = false;
    });
    console.log(this.enterpriseTypeList);
    this.TypeList = this.enterpriseTypeList;
    const list = [];
    if (this.configIdFlag) {
      if (this.userData.typeIds) {
        for (const item of this.userData.typeIds.split(',')) {
          for (const items of this.TypeList.filter(ele => ele.id === item)) {
            list.push(items);
          }
        }
        this.TypeList = list;
      }
    }
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
  getRoads(e) {
    if (e) {
      this.http.getRoads(e).subscribe(res => {
        this.roadIds = res;
      });
    }
  }
  // 获取用户信息
  getUserInfo(id) {
    this.id = id;
    this.http.modifyPriseUserInfo(id).subscribe((res: any) => {
      this.originalData = res;
      console.log(res.typeIds);
      if (res.typeIds) {
        if (res.typeIds.length > 0 || res.typeIds.length < this.TypeList.length) {
          this.indeterminate = true;
          for (const item of res.typeIds.split(',')) {
            for (const items of this.TypeList.filter(ele => ele.id === item)) {
              items.checked = true;
            }
          }
        }
      }
      this.getCitys(res.provinceId);
      this.getDistricts(res.cityId);
      this.getRoads(res.districtId);
      this.editForm.patchValue({
        loginName: res.loginName,
        provinceId: res.provinceId,
        cityId: res.cityId,
        districtId: res.districtId,
        roadId: res.roadId,
        roleIds: res.roleIds, // 角色名称
        name: res.name, // 姓名
        email: res.email,
        job: res.job,
        typeIds: res.typeIds ? res.typeIds.split(',') : null,
        orgIds: res.orgName ? res.orgName.replace(/,/g, '/') : null,
        jsmc: res.roleIds ? res.roleIds.split(',') : null,
        phoneCode: res.mobile,
        userRecordSee: res.userRecordSee
      });
      res.orgName.split(',').filter(ele => {
        this.agencyList.push({ label: ele });
      });
    });
  }
  // 关闭模态框
  handleCancel() {
    this.model.destroy();
  }
  selsectMultiple(e) {
    this.editForm.patchValue({ roleIds: e.join(',') });
  }
  modifyPriseUser(params) {
    const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    const chReg = /[\uFF00-\uFFEF]/;
    const isEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (this.reg.onValueChanged(params, this.editForm, this.http.formErrors, this.http.validationMessages) === '1') {
      return;
    }
    if (reg.test(params.loginName) || chReg.test(params.loginName)) {
      this.message.error('用户名不支持中文');
      return;
    } else if (params.loginName.length > 20 || params.loginName.length < 4) {
      this.message.error('用户名输入错误，请输入字母、数字、“-”、“_”一个或多个组合，4-20位!');
      return;
    }
    if (params.name.length > 20) {
      this.message.error('姓名称输入过长，请重新输入');
      return;
    }
    if (params.job) {
      if (params.job.length > 20) {
        this.message.error('职位过长');
        return;
      }
    }
    if (params.email) {
      if (!isEmail.test(params.email)) {
        this.message.error('邮箱格式错误，请重新输入');
        return;
      }
    }
    const systemCanSeeCodeList = [];
    this.systemCanSeeList.forEach(item => { systemCanSeeCodeList.push(item.val); });
    this.agencyList.forEach(item => { this.orgName.push(item.label); });
    const paramsLists = {
      id: this.id,
      orgId: this.orgName[this.orgName.length - 1],
      orgName: typeof (this.orgName) === 'string' ? this.orgName : this.orgName.join(','),
      loginName: params.loginName,
      provinceId: params.provinceId,
      cityId: params.cityId,
      districtId: params.districtId,
      roadId: params.roadId,
      roleIds: params.roleIds, // 角色名称
      name: params.name, // 姓名
      email: params.email,
      job: params.job,
      typeIds: typeof (params.typeIds) === 'string' ? params.typeIds : params.typeIds.join(','),
      level: this.cache.get('userData').level,
      systemCodes: systemCanSeeCodeList.join(','),
      mobile: params.phoneCode,
      userRecordSee: params.userRecordSee,
      updateBy: this.cache.get('userId'),
    };
    this.http.modifyGovernUser(paramsLists).subscribe((res: any) => {
      this.model.destroy('true');
      this.message.success('用户修改成功');
    });
  }
  getAgency(e) {
    if (e) {
      this.http.getAgencyTwo(e.option.value).subscribe((res: any) => {
        const options = [];
        res.filter(item => {
          const agency = { value: item.id, label: item.name, children: [], isLeaf: item.isLeaf }; // 机构对象
          options.push(agency);
        });
        e.option.children = options;
      });
    } else {
      this.http.getAgency().subscribe((res: any) => {
        const options = [];
        res.filter(item => {
          const agency = { value: item.id, label: item.name, children: [], isLeaf: item.isLeaf }; // 机构对象
          options.push(agency);
        });
        this.loadData = options;
      });
    }
  }
  agencyChange(e) {
    this.agencyList = e;
    const orgName = [];
    for (const item of e) {
      orgName.push(item.label);
    }
    this.orgName = orgName;
  }
  updateAllChecked(e) {
    this.indeterminate = false;
    if (e) {
      const arr = [];
      this.TypeList.forEach(item => item.checked = true);
      this.TypeList.forEach(item => {
        arr.push(item.id);
      });
      this.editForm.patchValue({ typeIds: arr });
    } else {
      this.TypeList.forEach(item => item.checked = false);
      this.editForm.patchValue({ typeIds: '' });

    }
  }
  selectCheckOpiton(res) {
    for (const it of this.TypeList) {
      it.checked = false;
    }
    for (const item of res) {
      for (const items of this.TypeList.filter(ele => ele.id === item)) {
        items.checked = true;
      }
    }
    this.editForm.patchValue({ typeIds: res });
    if (this.TypeList.every(item => item.checked === false)) {
      this.editForm.patchValue({ allChecked: false });
      this.indeterminate = false;
    } else if (this.TypeList.every(item => item.checked === true)) {
      this.editForm.patchValue({ allChecked: true });
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}
