import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CacheService } from '../../../../../core/cache/cache.service';
import { ManagerService } from '../../manager.service';
import { DictService } from '../../../../../core/dict/dict.service';
import { PassportService } from 'src/app/routes/passport/passport.service';

@Component({
  selector: 'app-edit-company-user',
  templateUrl: './edit-company-user.component.html',
  styleUrls: ['./edit-company-user.component.less']
})
export class EditCompanyUserComponent implements OnInit {
  editForm: FormGroup;
  editParams = [];
  roleList: any; // 角色列表
  provinces: any;
  citys: any;
  districts: any;
  roadIds: any;
  loginFlag: boolean;
  id: any; // 企业id
  sourceList: any;
  enterpriseTypeList: any; // 企业类型列表
  indeterminate = false;
  TypeList = [];
  systemCanSeeList: any;  // 系统可见
  originalData: any; // 原始数据
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
    this.editForm = this.fb.group({
      enterpriseName: ['', Validators.required],
      loginName: ['', Validators.required],
      provinceId: ['', Validators.required],
      cityId: ['', Validators.required],
      districtId: ['', Validators.required],
      roadId: [''],
      roleIds: ['', Validators.required], // 角色名称
      registrationAddress: ['', Validators.required], // 注册地址
      typeIds: ['', Validators.required],
      sourceId: ['', Validators.required],
      systemIds: ['', Validators.required],
      systemCodes: [''],
      systemNames: [''],
      registrationNumber: ['', Validators.required],
      xtkj: [''],
      qylx: [''],
      allChecked: false,
      phoneCode: ['']
    });
    this.getUserInfo(this.model.getContentComponent().item);
    this.sourceList = this.dict.get('source');
    this.systemCanSeeList = this.dict.get('system_view') || [];
    this.systemCanSeeList.forEach(element => {
      element.checked = false;
    });
    this.enterpriseTypeList = this.dict.get('userType');
    this.getRoleListByType();
    this.getProvince();
    this.enterpriseTypeList.forEach(element => {
      element.checked = false;
    });
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
    this.http.getRoleListByType('1', null).subscribe((res: any) => {
      this.roleList = res;
      this.editForm.patchValue({ 'roleIds': res[0].id });
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
      const code = [];
      if (res.systemIds) {
        for (const item of res.systemIds.split(',')) {
          for (const items of this.systemCanSeeList.filter(ele => ele.id === item)) {
            items.checked = true;
            code.push(items.val);
          }
        }
      }
      this.getCitys(res.provinceId);
      this.getDistricts(res.cityId);
      this.getRoads(res.districtId);
      if (this.configIdFlag) {
        if (res.provinceId) {
          this.provinceIdFlag = true;
        }
        if (res.cityId) {
          this.cityIdFlag = true;
        }
        if (res.districtId) {
          this.districtIdFlag = true;
        }
        if (res.roadId) {
          this.roadIdFlag = true;
        }
      }
      this.editForm.patchValue({
        enterpriseName: res.enterpriseName,
        loginName: res.loginName,
        provinceId: res.provinceId,
        cityId: res.cityId,
        districtId: res.districtId,
        roadId: res.roadId,
        roleIds: res.roleIds, // 角色名称
        registrationAddress: res.registrationAddress, // 注册地址
        typeIds: res.typeIds ? res.typeIds.split(',') : null,
        systemIds: res.systemIds,
        systemCodes: code.join(','),
        systemNames: res.systemNames,
        sourceId: res.sourceId,
        registrationNumber: res.registrationNumber,
        system: [''],
        phoneCode: res.mobile
      });
      if (this.editForm.value.loginName) {
        this.loginFlag = true;
      } else {
        this.loginFlag = false;
      }
    });
  }
  // 关闭模态框
  handleCancel() {
    this.model.destroy();
  }
  // 修改用户
  modifyPriseUser(params) {
    const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    const chReg = /[\uFF00-\uFFEF]/;
    // 判断必填项是否为空
    if (this.reg.onValueChanged(params, this.editForm, this.http.formErrors, this.http.validationMessages) === '1') {
      return;
    }
    if (reg.test(params.loginName) || chReg.test(params.loginName)) {
      this.message.error('用户名不支持中文');
      return;
    } else if (params.loginName.length > 21 || params.loginName.length < 4) {
      this.message.error('用户名输入错误，请输入字母、数字、“-”、“_”一个或多个组合，4-21位!');
      return;
    }
    const paramsLists = {
      id: this.id,
      enterpriseName: params.enterpriseName,
      loginName: params.loginName,
      provinceId: params.provinceId,
      cityId: params.cityId,
      districtId: params.districtId,
      roadId: params.roadId,
      roleIds: params.roleIds, // 角色名称
      registrationAddress: params.registrationAddress, // 注册地址
      typeIds: typeof (params.typeIds) === 'string' ? params.typeIds : params.typeIds.join(','),
      sourceId: params.sourceId,
      systemIds: params.systemIds,
      systemCodes: params.systemCodes,
      systemNames: params.systemNames,
      registrationNumber: params.registrationNumber,
      mobile: params.phoneCode
    };
    if (this.loginFlag) {
      paramsLists.loginName = null;
      this.http.modifyPriseUser(paramsLists).subscribe((res: any) => {
        this.model.destroy('true');
        this.message.success('用户修改成功');
      });
    } else {
      this.http.verifyReLoginName(paramsLists.loginName).subscribe((ress: any) => {
        if (ress.isExist === '0') {
          this.http.modifyPriseUser(paramsLists).subscribe((res: any) => {
            this.model.destroy('true');
            this.message.success('用户修改成功');
          });
        } else if (ress.isExist === '1') {
          this.message.error('用户名已存在，请重新输入');
        }
      });
    }
  }
  // 全选按钮
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
  // 企业类型变化赋值
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
  // 系统可见变化赋值
  selectCheckOpiton2(res) {
    const systemIds = [];
    const systemCodes = [];
    const systemNames = [];
    // name
    for (const item of res) {
      systemIds.push(item.id);
      systemCodes.push(item.val);
      systemNames.push(item.name);
    }
    this.editForm.patchValue({ systemIds: systemIds.join(',') });
    this.editForm.patchValue({ systemCodes: systemCodes.join(',') });
    this.editForm.patchValue({ systemNames: systemNames.join(',') });
  }
}
