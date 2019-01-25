import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from '../../../../../core/cache/cache.service';
import { DictService } from '../../../../../core/dict/dict.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ReformService } from '../../reform.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creat-workallot',
  templateUrl: './creat-workallot.component.html',
  styleUrls: ['./creat-workallot.component.less']
})
export class CreatWorkallotComponent implements OnInit {
  // 整改验收表
  createForm: FormGroup;
  tabType = false;
  districts: any;
  districts2: any;
  layerGroupList: any; // 律所
  accountantGroupList: any; // 会所
  enterList: any; // 企业列表
  peopleList: any;
  layerList: any;
  accountantList: any;
  peopleGroupList: any; // 核查祖名列表


  indeterminate1 = false;
  indeterminate2 = false;
  indeterminate3 = false;
  indeterminate4 = false;
  indeterminate5 = false;
  indeterminate6 = false;
  displayData1: any;
  displayData2: any;
  displayData3: any;
  displayData4: any;
  displayData5: any;
  displayData6: any;
  allChecked1 = false;
  allChecked2 = false;
  allChecked3 = false;
  allChecked4 = false;
  allChecked5 = false;
  allChecked6 = false;
  // 创建传值项
  accountId = [];
  accountIds = [];
  enterpriseIds = [];
  govIds = [];
  lawyerId = [];
  lawyerIds = [];
  groupId = [];
  companySelId = [];
  complianceCheckConfig: any;
  flag0 = true;
  flag1 = true;
  flag2 = true;
  flag3 = true;
  flag4 = true;
  flag5 = true;
  flag6 = true;
  constructor(private fb: FormBuilder,
    private cache: CacheService,
    private http: ReformService,
    private dict: DictService,
    public router: Router,
    private message: NzMessageService) { }

  ngOnInit() {
    console.log(this.cache.get('complianceCheckConfig'));
    this.complianceCheckConfig = this.cache.get('complianceCheckConfig');

    if (this.complianceCheckConfig && this.complianceCheckConfig.length > 0) {
      this.flag0 = this.complianceCheckConfig[0].visible === '0';
      this.flag1 = this.complianceCheckConfig[1].visible === '0';
      this.flag2 = this.complianceCheckConfig[2].visible === '0';
      this.flag3 = this.complianceCheckConfig[3].visible === '0';
      this.flag4 = this.complianceCheckConfig[4].visible === '0';
      this.flag5 = this.complianceCheckConfig[5].visible === '0';
      this.flag6 = this.complianceCheckConfig[6].visible === '0';
    }
    this.getDistricts();
    this.getDistricts2();
    this.getaccountantGroupList('');
    this.getLayerGroupList('');

    this.createForm = this.fb.group({
      companyName: [],
      countyCode: [''],
      accountantGroup: [''],
      layerGroup: [''],
      adminName: [''],
      checkGroupName: [''],
      countyCode2: [''],
    });
    // this.getEnterList(this.createForm.value);
    this.getcheckGroupList();
  }
  public allotType(data) {
    if (data === '1') {
      this.tabType = false;
      // this.createForm.reset();
    } else {
      this.tabType = true;
      // this.createForm.reset();
    }
  }
  // 获取企业区列表
  getDistricts() {
    this.http.getDistricts(this.cache.get('userId')).subscribe((res: any) => {
      this.districts = res[0].children[0].children;
    });
  }
  // 获取审查区域
  getDistricts2() {
    this.http.getDistricts('').subscribe((res: any) => {
      // console.log(res[0].children[0].children);
      this.districts2 = res[0].children[0].children;
    });
  }
  // 获取律所list
  getLayerGroupList(id) {
    this.http.getLawyerList(id).subscribe((res: any) => {
      this.layerGroupList = res;
    });
  }
  // 会所
  getaccountantGroupList(id) {
    this.http.getAccountList(id).subscribe((res: any) => {
      this.accountantGroupList = res;
    });
  }
  // 获取企业列表
  getEnterList(params) {
    // if (!params.countyCode) {
    //   this.message.error('请选择区域！');
    //   return;
    // }
    this.http.getEnterpriseList(params.companyName, params.countyCode).subscribe((res: any) => {
      this.enterList = res === null ? [] : res;
    });
  }
  // 获取核查组名列表
  getcheckGroupList() {
    this.http.getcheckGroup().subscribe((res: any) => {
      this.peopleGroupList = res;
    });
  }
  // 获取会所/律所列表
  getClubUserList(index, params) {
    const id = index === '1' ? params.accountantGroup : params.layerGroup;
    this.http.getClubUserList(id).subscribe((res: any) => {
      if (index === '1') {
        this.accountantList = res;
      } else {
        this.layerList = res;
      }
    });
  }
  // 获取审查人列表
  getGovUserList(params) {
    if (!params.countyCode2) {
      this.message.error('请选择区域！');
    }
    this.http.getGovUserList(params.countyCode2, params.adminName).subscribe((res: any) => {
      this.peopleList = res;
    });
  }
  // 全选  企业列表
  checkAll(index, e) {
    let item: any;
    item = this.Judge(index);
    item.forEach(data => {
      if (!data.disabled) {
        data.checked = e;
      }
    });
    this.refreshStatus(index);
  }

  // 刷新状态
  refreshStatus(index) {
    let item: any;
    item = this.Judge(index);
    const allChecked = item.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = item.filter(value => !value.disabled).every(value => !value.checked);
    if (index === '1') {
      this.ceshi(this.allChecked1, this.indeterminate1, item, this.companySelId, allChecked, allUnChecked);
    } else if (index === '2') {
      this.ceshi(this.allChecked2, this.indeterminate2, item, this.groupId, allChecked, allUnChecked);
      const list = item.filter(value => value.checked);
      if (list.length > 9) {
        list[list.length - 1].checked = false;
        this.message.error('最多能选择9个审查人');
      }
      console.log(this.displayData2);
    } else if (index === '3') {
      this.ceshi(this.allChecked3, this.indeterminate3, item, this.enterpriseIds, allChecked, allUnChecked);
    } else if (index === '4') {
      this.ceshi(this.allChecked4, this.indeterminate4, item, this.accountIds, allChecked, allUnChecked);
    } else if (index === '5') {
      this.ceshi(this.allChecked5, this.indeterminate5, item, this.lawyerIds, allChecked, allUnChecked);
    } else if (index === '6') {
      this.ceshi(this.allChecked6, this.indeterminate6, item, this.govIds, allChecked, allUnChecked);
    }
  }
  ceshi(allcheck, indeterminate, item, data, allChecked, allUnChecked) {
    allcheck = allChecked;
    indeterminate = (!allChecked) && (!allUnChecked);
    for (const iterator of item.filter(value => value.checked)) {
      data.push(iterator.id);
      data = this.dedupe(data);
    }
  }
  selsectActive(e) {
  }
  currentPageDataChange(index, e) {
    if (index === '1') {
      this.displayData1 = e;
    } else if (index === '2') {
      this.displayData2 = e;
    } else if (index === '3') {
      this.displayData3 = e;
    } else if (index === '4') {
      this.displayData4 = e;
    } else if (index === '5') {
      this.displayData5 = e;
    } else if (index === '6') {
      this.displayData6 = e;
    }
    this.refreshStatus(index);
  }
  Judge(index) {
    let item: any;
    if (index === '1') {
      item = this.displayData1;
    } else if (index === '2') {
      item = this.displayData2;
    } else if (index === '3') {
      item = this.displayData3;
    } else if (index === '4') {
      item = this.displayData4;
    } else if (index === '5') {
      item = this.displayData5;
    } else if (index === '6') {
      item = this.displayData6;
    }
    return item;
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  create(params) {
    if (!this.tabType) {
      if (this.companySelId.length === 0) {
        this.message.error('请选择企业');
        return;
      }
      if (this.groupId.length === 0) {
        this.message.error('请选择审查人');
        return;
      }
      this.http.creatreform(this.companySelId, this.groupId).subscribe((res: any) => {
        this.message.success('任务创建成功');
        this.router.navigate(['/main/reform/workallotCheck']);
      });
    } else {
      const paramsList = {
        accountId: params.accountantGroup,
        accountIds: this.accountIds.join(','),
        enterpriseIds: this.enterpriseIds.join(','),
        govIds: this.govIds.join(','),
        lawyerId: params.layerGroup,
        lawyerIds: this.lawyerIds.join(','),
      };
      this.http.creatreform2(paramsList).subscribe((res: any) => {
        this.message.success('任务创建成功');
        this.router.navigate(['/main/reform/workallotCheck']);
      });
    }
  }
  // 数组去重
  dedupe(array) {
    return Array.from(new Set(array));
  }
}
