import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from '../../../../../core/cache/cache.service';
import { OnsiteService } from '../../onsite.service';
import { DictService } from '../../../../../core/dict/dict.service';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;
  provinces: any;
  citys: any;
  districts: any;
  roads: any;
  proper: any;
  freq: any;
  groupCheckList: any;
  companytpyes: any;
  allChecked = false;
  indeterminate = false;
  displayData = [];
  allChecked1 = false;
  indeterminate1 = false;
  displayData1 = [];
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];
  userLists: any;
  enterList: any;
  isloading: boolean;
  isloading1: boolean;
  // 核查人
  peopleNameList = [];
  peopleIdList = [];
  // 企业
  companyNameList = [];
  companyIdList = [];

  constructor(private fb: FormBuilder,
    private cache: CacheService,
    private http: OnsiteService,
    private dict: DictService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    // 字典查询
    this.proper = this.dict.get('check_proper'); // 核查性质
    this.freq = this.dict.get('check_freq'); // 核查频率
    this.companytpyes = this.dict.get('userType'); // 企业类型  company_type
    console.log(this.cache.get('userData'));
    this.getCitys(this.cache.get('userData').provinceId);
    this.getDistricts(this.cache.get('userData').cityId);
    this.getRoads(this.cache.get('userData').districtId);
    this.getCheckGroup();
    this.createForm = this.fb.group({
      provinceCode: this.cache.get('userData').provinceId ? this.cache.get('userData').provinceId : [''],
      cityCode: this.cache.get('userData').cityId ? this.cache.get('userData').cityId : [''],
      countyCode: this.cache.get('userData').districtId ? this.cache.get('userData').districtId : [''],
      roadId: this.cache.get('userData').roadId ? this.cache.get('userData').roadId : [''],
      checkProper: [''],
      checkItemGroupId: [],
      companyType: [''],
      checkFreq: [''],
      startTime: [''],
      endTime: [''],
      peoName: [''],
      companyName: [''],
    });
    this.getProvince();
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
        if (this.createForm.value.cityCode && this.createForm.value.companyType) {
          this.getUserList(this.createForm.value);
          this.getEnterList(this.createForm.value);
        }
      });
    }
  }
  // 获取街道
  getRoads(e) {
    if (e) {
      this.http.getRoads(e).subscribe(res => {
        this.roads = res;
      });
    }
  }
  // 获取核查项组
  getCheckGroup() {
    this.http.getCheckGroup({
      'createUser': this.cache.get('userId'),
      'userId': this.cache.get('userId')
    }).subscribe(res => this.groupCheckList = res);
  }
  // 获取企业列表
  getEnterList(param) {
    console.log(param);
    if (!param.countyCode) {
      this.message.error('请选择区');
      return;
    } else if (!param.companyType) {
      this.message.error('请选择企业类型');
      return;
    }
    const params: any = {
      id: this.cache.get('userId'),
      name: param.companyName,
      provinceID: param.provinceCode,
      cityID: param.cityCode,
      districtID: param.countyCode,
      roadID: param.roadId,
      dictID: param.companyType,
      registrationAddress: 'string',
      registrationNumber: 'string',
      businessSituation: 'string',
      systemCodes: 'string',
      // source: 'string',
      // listStatus: [],
      // listCheckProper: [],
      // listSource: [],
      // status: 'string',
      // checkProper: 'string',
      // checkPerson: 'string',
    };
    this.isloading = true;
    if (param.cityCode && param.companyType) {
      this.http.getEnterList(params).subscribe(res => {
        console.log(res);
        this.enterList = res;
        this.isloading = false;
      });
    }
  }

  // 获取核查人列表
  getUserList(param) {
    if (!param.cityCode) {
      this.message.error('请选择城市');
      return;
    } else if (!param.companyType) {
      this.message.error('请选择企业类型');
      return;
    }
    const params: any = {
      id: this.cache.get('userId'),
      pageSize: 10000,
      pageNumber: 1,
      roleIds: '',
      provinceId: param.provinceCode,
      cityId: param.cityCode,
      districtId: param.countyCode,
      roadId: param.roadId,
      level: '',
      loginName: '',
      name: param.peoName,
    };
    this.isloading1 = true;
    if (param.cityCode && param.companyType) {
      this.http.getUserList(params).subscribe((res: any) => {
        this.isloading1 = false;
        this.userLists = res.userList;
      });
    }
  }
  // 发布任务
  create(params) {
    // 判断 创建条件
    if (!params.countyCode && !params.provinceCode && !params.cityCode) {
      this.message.error('请至少选择所属区域到第三级区域');
      return;
    }
    if (!params.checkItemGroupId) {
      this.message.error('请选择核查项组');
      return;
    }
    if (!params.checkProper) {
      this.message.error('请选择核查性质');
      return;
    }
    if (this.peopleNameList.length === 0) {
      this.message.error('请选择核查人');
      return;
    }
    if (this.companyNameList.length === 0) {
      this.message.error('请选择核查企业');
      return;
    }
    if (!params.checkFreq) {
      this.message.error('请选择核查频率');
      return;
    }
    if (!params.startTime) {
      this.message.error('请选择任务开始时间');
      return;
    }
    const paramsList: any = {
      checkPersonsId: this.peopleIdList.join(','), // 请选择核查人ID
      checkPersonsName: this.peopleNameList.join(','), // 请选择核查人
      companysCode: this.companyIdList.join(','), // 核查企业id
      companysName: this.companyNameList.join(','), // 核查企业名称
      createUse: 'string',
      id: 'string',
      status: '1',
      taskId: '1',
      userId: this.cache.get('userId'),
      ...params
    };

    this.http.insertTaskGroupTemp(paramsList).subscribe(res => {
      this.message.success('任务创建成功');
      setTimeout(() => history.go(-1), 1000);
    });
  }
  // 时间
  onChange(e): void {

  }

  // 刷新状态
  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    for (const item of this.displayData.filter(value => value.checked)) {
      this.companyNameList.push(item.name);
      this.companyIdList.push(item.id);
      this.companyNameList = this.dedupe(this.companyNameList);
      this.companyIdList = this.dedupe(this.companyIdList);
    }

    this.indeterminate = (!allChecked) && (!allUnChecked);
  }
  // 全选  企业列表
  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }
  // 刷新状态
  refreshStatus1(): void {
    const allChecked = this.displayData1.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData1.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked1 = allChecked;
    for (const iterator of this.displayData1.filter(value => value.checked)) {
      this.peopleNameList.push(iterator.name);
      this.peopleIdList.push(iterator.id);
      this.peopleNameList = this.dedupe(this.peopleNameList);
      this.peopleIdList = this.dedupe(this.peopleIdList);
    }
    this.indeterminate1 = (!allChecked) && (!allUnChecked);
  }
  // 全选 核查人列表
  checkAll1(value: boolean): void {
    this.displayData1.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus1();
  }
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus();
  }
  currentPageDataChange1($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData1 = $event;
    this.refreshStatus1();
  }
  // 返回
  goBack() {
    history.go(-1);
  }

  selectCheckOpiton(res) {
    if (this.createForm.value.cityCode && this.createForm.value.companyType) {
      this.getUserList(this.createForm.value);
      this.getEnterList(this.createForm.value);
    }
  }
  // 数组去重
  dedupe(array) {
    return Array.from(new Set(array));
  }
}
