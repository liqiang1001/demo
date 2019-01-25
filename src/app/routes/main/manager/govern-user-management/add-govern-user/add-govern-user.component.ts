import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CacheService } from '../../../../../core/cache/cache.service';
import { ManagerService } from '../../manager.service';
import { DictService } from '../../../../../core/dict/dict.service';
import { PassportService } from 'src/app/routes/passport/passport.service';
// import { validateRex } from './../../../../../core/regex/validate-register';

@Component({
  selector: 'app-add-govern-user',
  templateUrl: './add-govern-user.component.html',
  styleUrls: ['./add-govern-user.component.less']
})
export class AddGovernUserComponent implements OnInit {
  addForm: FormGroup;
  addParams = [];
  roleList: any; // 角色列表
  provinces: any;
  citys: any;
  districts: any;
  roadIds: any;
  sourceList: any;
  enterpriseTypeList: any; // 企业类型列表
  TypeList = [];
  systemCanSeeList: any;  // 系统可见
  agencyList: any;  // 机构
  orgName: any;
  loadData: any;
  showPass: boolean;
  indeterminate = false; // 全选
  allChecked = false;
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
    console.log(this.cache.get('userData'));
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
    this.addForm = this.fb.group({
      loginName: ['', Validators.required],
      provinceId: [provinceId ? provinceId : '', Validators.required],
      cityId: [cityId ? cityId : '', Validators.required],
      districtId: districtId ? districtId : [''],
      roadId: roadId ? roadId : [''],
      roleIds: [null, Validators.required], // 角色名称
      name: ['', Validators.required], // 姓名
      email: ['', Validators.required],
      job: ['', Validators.required],
      typeIds: ['', Validators.required],
      orgIds: ['', Validators.required],
      pwd: '123456',
      defPassword: true,
      passWord: [''],
      passWord2: [''],
      allChecked: false,
      phoneCode: [''],
      userRecordSee: 0
    });
    this.getAgency('');
    this.sourceList = this.dict.get('source');
    this.systemCanSeeList = this.dict.get('system_view');
    this.enterpriseTypeList = this.dict.get('userType');
    this.getRoleListByType();
    this.getProvince();
    if (this.enterpriseTypeList) {
      this.enterpriseTypeList.forEach(element => {
        element.checked = false;
      });
    }
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
  addpriseUser(params) {
    console.log(params);
    let newConfigID = null;
    if (!this.configIdFlag) {
      if (params.roleIds) {
        for (const item of params.roleIds) {
          for (const items of this.roleList.filter(ele => ele.id === item)) {
            if (items.configId) {
              newConfigID = items.configId;
              break;
            }
          }
        }
      }
    }
    const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    const chReg = /[\uFF00-\uFFEF]/;
    const isEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    let pwd = '123456';
    if (this.reg.onValueChanged(params, this.addForm, this.http.formErrors, this.http.validationMessages) === '1') {
      return;
    }
    if (reg.test(params.loginName) || chReg.test(params.loginName)) {
      this.message.error('用户名不支持中文');
      return;
    }
    if (params.loginName.length > 20 || params.loginName.length < 4) {
      this.message.error('用户名输入错误，请输入字母、数字、“-”、“_”一个或多个组合，4-20位!');
      return;
    }
    if (params.name.length > 20) {
      this.message.error('姓名称输入过长，请重新输入');
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
        pwd = params.passWord;
      }
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
    if (!this.configIdFlag) {
      if (params.roleIds) {
        for (const item of params.roleIds) {
          for (const items of this.roleList.filter(ele => ele.configId)) {
            console.log(items);
          }
        }
      }
    }
    const paramsLists = {
      orgId: params.orgIds[params.orgIds.length - 1],
      orgName: this.orgName,
      loginName: params.loginName,
      provinceId: params.provinceId,
      cityId: params.cityId,
      districtId: params.districtId,
      roadId: params.roadId,
      roleIds: typeof (params.roleIds) === 'string' ? params.roleIds : params.roleIds.join(','), // 角色名称
      name: params.name, // 姓名
      email: params.email,
      job: params.job,
      typeIds: typeof (params.typeIds) === 'string' ? params.typeIds : params.typeIds.join(','),
      pwd: pwd,
      level: this.cache.get('userData').level,
      systemCodes: typeof (systemCanSeeCodeList) === 'string' ? systemCanSeeCodeList : systemCanSeeCodeList.join(','),
      mobile: params.phoneCode,
      userRecordSee: params.userRecordSee,
      configId: this.configIdFlag ? this.configId : newConfigID,
      createBy: this.cache.get('userId'),
    };
    this.http.verifyReLoginName(params.loginName).subscribe((ress: any) => {
      if (ress.isExist === '0') {
        this.http.verifyReEmail(params.email).subscribe((res: any) => {
          if (ress.isExist === '0') {
            this.http.addgovernUser(paramsLists).subscribe((res1: any) => {
              this.message.success('添加机构用户成功');
              this.model.destroy('true');
            });
          }
        });
      } else if (ress.isExist === '1') {
        this.message.error('用户名已存在，请重新输入');
      }
    });
  }
  selectPassword(e) {
    this.showPass = !e;
  }
  // 关闭模态框
  handleCancel() {
    this.model.destroy();
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
    this.orgName = orgName.join(',');
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
}
