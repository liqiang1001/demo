import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { CacheService } from '../../../../../core/cache/cache.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import { DictService } from '../../../../../core/dict/dict.service';
import { PassportService } from 'src/app/routes/passport/passport.service';

@Component({
  selector: 'app-add-company-user',
  templateUrl: './add-company-user.component.html',
  styleUrls: ['./add-company-user.component.less']
})
export class AddCompanyUserComponent implements OnInit {
  addForm: FormGroup;
  addParams = [];
  roleList: any; // 角色列表
  provinces: any;
  citys: any;
  districts: any;
  roadIds: any;
  sourceList: any;
  enterpriseTypeList: any; // 企业类型列表
  indeterminate = false;
  TypeList = [];
  systemCanSeeList: any;  // 系统可见
  showPass: boolean;
  addFlag: boolean;
  configId: any;
  configIdFlag: boolean;
  userData: any;
  provinceIdFlag: boolean;
  districtIdFlag: boolean;
  cityIdFlag: boolean;
  roadIdFlag: boolean;
  constructor(private message: NzMessageService,
    private fb: FormBuilder, private cache: CacheService,
    private model: NzModalRef, private reg: PassportService,
    private http: ManagerService, private dict: DictService) { }

  ngOnInit() {
    // if (this.model.getContentComponent().item === 1) {
    //   this.addFlag = true;
    // }
    this.addFlag = this.model.getContentComponent().item === 1
    this.userData = this.cache.get('userData');
    this.configId = this.cache.get('userData').configId;
    this.configIdFlag = this.cache.get('userData').configId ? true : false;
    let provinceId;
    let cityId;
    let districtId;
    let roadId;
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
        this.getRoads(districtId);
        this.districtIdFlag = true;
      }
      if (this.userData.roadId) {
        roadId = this.userData.roadId;
        this.roadIdFlag = true;
      }
    }
    this.sourceList = this.dict.get('source');
    this.systemCanSeeList = this.dict.get('system_view');
    this.enterpriseTypeList = this.dict.get('userType');
    this.getRoleListByType();
    this.getProvince();
    if (this.addFlag) {
      this.addForm = this.fb.group({
        enterpriseName: ['', Validators.required],
        loginName: [''],
        provinceId: [provinceId ? provinceId : '', Validators.required],
        cityId: [cityId ? cityId : '', Validators.required],
        districtId: [districtId ? districtId : '', Validators.required],
        roadId: roadId ? roadId : [''],
        roleIds: [''], // 角色名称
        registrationAddress: [''], // 注册地址
        typeIds: ['', Validators.required],
        sourceId: [''],
        systemIds: [''],
        systemCodes: [''],
        systemNames: [''],
        registrationNumber: [''],
        pwd: '123456',
        defPassword: true,
        passWord: [''],
        passWord2: [''],
        allChecked: false,
        phoneCode: [''],
      });
    } else {
      this.addForm = this.fb.group({
        enterpriseName: ['', Validators.required],
        loginName: ['', Validators.required],
        provinceId: [provinceId ? provinceId : '', Validators.required],
        cityId: [cityId ? cityId : '', Validators.required],
        districtId: [districtId ? districtId : '', Validators.required],
        roadId: roadId ? roadId : [''],
        roleIds: ['', Validators.required], // 角色名称
        registrationAddress: ['', Validators.required], // 注册地址
        typeIds: ['', Validators.required],
        sourceId: ['', Validators.required],
        systemIds: ['', Validators.required],
        systemCodes: [''],
        systemNames: [''],
        registrationNumber: ['', Validators.required],
        pwd: '123456',
        defPassword: true,
        passWord: [''],
        passWord2: [''],
        allChecked: false,
        phoneCode: [''],
      });
    }


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
      this.addForm.patchValue({ 'roleIds': res[0].id });
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
  // 添加用户
  addpriseUser(params) {
    const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    const chReg = /[\uFF00-\uFFEF]/;
    if (this.addFlag) {
      this.selectCheckOpiton2(this.systemCanSeeList.slice(0, 2));
      params = this.addForm.value;
    }
    if (this.reg.onValueChanged(params, this.addForm, this.http.formErrors, this.http.validationMessages) === '1') {
      return;
    }
    if (!this.addFlag) {
      if (reg.test(params.loginName) || chReg.test(params.loginName)) {
        this.message.error('用户名不支持中文');
        return;
      } else if (params.loginName.length > 21 || params.loginName.length < 4) {
        this.message.error('用户名输入错误，请输入字母、数字、“-”、“_”一个或多个组合，4-21位!');
        return;
      }
      if (!params.defPassword) {
        if (!params.passWord) {
          this.message.error('请输入需要设定的密码!');
          return;
        } else if (params.passWord.length < 8 || params.passWord.length > 25) {
          this.message.error('密码长度为8-25位，请重新输入！');
          return;
        } else if (params.passWord !== params.passWord2) {
          this.message.error('两次输入密码不匹配');
          return;
        } else {
          this.addForm.patchValue({ pwd: params.passWord });
        }
      }
    }
    params.typeIds = params.typeIds.join(',');
    const paramsLists = {
      mobile: params.phoneCode,
      configId: null,
      ...params
    };
    if (params.loginName) {
      this.http.verifyReLoginName(params.loginName).subscribe((ress: any) => {
        if (ress.isExist === '0') {
          this.http.addpriseUser(paramsLists).subscribe((res: any) => {
            if (!res) {
              this.message.success('添加机构用户成功');
              this.model.destroy('true');
            } else {
              this.message.error(res.message);
              params.typeIds = params.typeIds.split(',');
            }
          });
        } else if (ress.isExist === '1') {
          this.message.error('用户名已存在，请重新输入');
        }
      });
    } else {
      this.http.addpriseUser(paramsLists).subscribe((res: any) => {
        if (!res) {
          this.message.success('添加机构用户成功');
          this.model.destroy('true');
        } else {
          this.message.error(res.message);
          params.typeIds = params.typeIds.split(',');
        }
      });
    }
  }
  updateAllChecked(e) {
    this.indeterminate = false;
    if (e) {
      const arr = [];
      this.TypeList.forEach(item => item.checked = true);
      this.TypeList.forEach(item => {
        arr.push(item.id);
      });
      this.addForm.patchValue({ typeIds: arr });
    } else {
      this.TypeList.forEach(item => item.checked = false);
      this.addForm.patchValue({ typeIds: '' });
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
    this.addForm.patchValue({ typeIds: res });
    if (this.TypeList.every(item => item.checked === false)) {
      this.addForm.patchValue({ allChecked: false });
      this.indeterminate = false;
    } else if (this.TypeList.every(item => item.checked === true)) {
      this.addForm.patchValue({ allChecked: true });
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
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
    this.addForm.patchValue({ systemIds: systemIds.join(',') });
    this.addForm.patchValue({ systemCodes: systemCodes.join(',') });
    this.addForm.patchValue({ systemNames: systemNames.join(',') });
  }
  selectPassword(e) {
    this.showPass = !e;
  }
  // 关闭模态框
  handleCancel() {
    this.model.destroy();
  }
}
