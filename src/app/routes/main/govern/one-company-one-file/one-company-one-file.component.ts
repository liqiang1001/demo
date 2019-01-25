import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CacheService } from '../../../../core/cache/cache.service';
import { GovernService } from '../govern.service';
import { DictService } from '../../../../core/dict/dict.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DefaultService } from 'src/app/layout/default/default.service';

@Component({
  selector: 'app-one-company-one-file',
  templateUrl: './one-company-one-file.component.html',
  styleUrls: ['./one-company-one-file.component.less']
})
export class OneCompanyOneFileComponent implements OnInit, OnDestroy {


  // 字典
  citys: any;
  districts: any;
  conpanyNameData: any; // 企业类型
  sourceNames: any;  // 来源
  rectificationStatusNames: any; // 整改
  businessSituationNames: any;  // 经营列表：

  // 搜索表格
  searchForm: FormGroup;
  searchParams = [];
  selsetItems = new FormControl('');
  // 搜索列表
  indeterminate = false;
  displayData = [];
  displayColumn = false;
  govColumn: any;
  clickFlag = true;
  checkType = '暂无';
  width = 700;
  selects: any;
  enterMsg: any;
  checkedAll: any;
  checkBoxList: any;
  datas; // 企业信息服务器传来的数据
  rowSelectionTable: any;
  buttonAuthData = [];

  isloading: boolean;
  // 分页
  pageIndex = 1;
  pageSize = 10;
  total: any;
  pagesCount: any;
  // 弹框
  isVisible = false;
  isVisible1 = false;
  checkTypeList: any;
  time: any;
  menuList = [
    { id: 34, name: '导出', show: false },
    { id: 147, name: '企业报告', show: false },
    { id: 148, name: '工作台账', show: false },
    { id: 35, name: '编辑', show: false },
  ];
  constructor(public router: Router, private fb: FormBuilder,
    private _CacheService: CacheService, private _GovernService: GovernService,
    private activeRoute: ActivatedRoute,
    private menuHttp: DefaultService,
    private dict: DictService, private http: HttpClient) { }
  ngOnInit() {
    this.getMenuAccess();
    let userData = {};
    this.time = setInterval(() => {
      if (this.dict.get('GovWorkType')) {
        this.checkTypeList = this.dict.get('GovWorkType').slice(0, 3);
      }
      this.sourceNames = this.dict.get('source');
      this.conpanyNameData = this.dict.get('userType');
      this.rectificationStatusNames = this.dict.get('rectification_status');  // 整改状态
      this.businessSituationNames = this.dict.get('operating_status');  // 经营状态
      this.dict.get('work_progress');  // 工作进展
      this.dict.get('classification');  // 分类处置
      this.dict.get('enterprise_batch');  // 通知书批次
      this.dict.get('yes_or_no');  // 现金贷业务
      if (this._CacheService.get('userData')) {
        userData = this._CacheService.get('userData');
        this._getCitys();
      }
      if (this.checkTypeList && this.sourceNames && this.conpanyNameData && this.rectificationStatusNames && this.businessSituationNames) {
        clearInterval(this.time);
      }
    }, 500);
    this.searchForm = this.fb.group({
      name: '',
      registrationNumber: [''],
      source: [''],
      rectificationStatus: [''],
      businessSituation: [''],
      remarkKeyWord: [''], // 关键字
      cityId: [''],
      districtId: [''], // 区
      typeIds: [],
      checkType: [],
      platform: [],
    });
    this._getDataList(this.searchForm.value);
  }
  openColumn() {
    this.displayColumn = !this.displayColumn;
  }

  initSelects(checkedData) {  // 用获取到的数据初始化selects数组，作为表头标题
    const that = this;
    this.selects = [];
    checkedData.forEach(element => {
      if (element.check) {
        that.selects.push(element);
      }
    });
    this.showCompanyData();
  }

  selectCheckbox(check: boolean, value) {  // 自定义列复选框点击选中
    const index: number = this.selects.indexOf(value);
    if (check) {
      if (index < 0) {
        this.selects.push(value);
      }
    } else {
      if (index > -1) {
        // 默认不能修改的，不从数组中删除
        if (!value.readOnly) {
          this.selects = this.selects.filter((ele) => {
            return ele !== value;
          });
        }
      }
    }
    // 数据排序
    this.selects.sort(this.compare);
    this.showCompanyData();
  }

  showCompanyData() {  // 根据自定义选择数量，更新列表
    const that = this;
    this.enterMsg = [];
    for (let i = 0; i < this.rowSelectionTable.length; i++) {
      const obj = [];
      for (let j = 0; j < that.selects.length; j++) {
        if (!that.rowSelectionTable[i]['checkType']) {
          that.rowSelectionTable[i]['checkType'] = '暂无';
        } else {
          if (this.checkTypeList) {
            for (const items of this.checkTypeList.filter(item => item.id === this.rowSelectionTable[i]['checkType'])) {
              that.rowSelectionTable[i]['checkType'] = items.name;
            }
          } else {
            if (this.rowSelectionTable[i]['checkType'] === 'GovWorkType1') {
              that.rowSelectionTable[i]['checkType'] = '整改';
            }
            if (this.rowSelectionTable[i]['checkType'] === 'GovWorkType2') {
              that.rowSelectionTable[i]['checkType'] = '退出';
            }
            if (this.rowSelectionTable[i]['checkType'] === 'GovWorkType3') {
              that.rowSelectionTable[i]['checkType'] = '风险处置';
            }
          }
        }
        obj.push(that.rowSelectionTable[i][that.selects[j].remark] ? that.rowSelectionTable[i][this.selects[j].remark] : '');
      }
      this.enterMsg.push(obj);
    }
    console.log(this.enterMsg);
  }
  // 排序比较函数
  compare(val1, val2) {
    return val1.sortNum - val2.sortNum;
  }

  singleSelect(check: boolean, value) {  // 点击单个的checkbox
    const index: number = this.checkBoxList.indexOf(value);
    if (check) {
      if (index < 0) {
        this.checkBoxList.push(value);
      }
    } else {
      if (index > -1) {
        this.checkBoxList = this.checkBoxList.filter((ele) => {
          return ele !== value;
        });
      }
    }
    this.isSelectedAll();
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
  isSelectedAll() {
    return this.checkedAll = this.checkBoxList.length === this.enterMsg.length;
  }
  // 获取城市
  _getCitys() {
    const that = this;
    const city = {
      parentId: '',
      userId: '',
      rankNum: '2'
    };
    if (this._CacheService.get('userData')) {
      city.parentId = this._CacheService.get('userData').provinceId;
    }
    city.userId = this._CacheService.get('userId');
    this._GovernService.getCitys(city).subscribe(res => {
      this.citys = res;
    });
  }
  // 获取区
  _getDistricts(e) {
    const that = this;
    const area = {
      'parentId': e, // cityid
      'rankNum': '3',
      'userId': this._CacheService.get('userId')
    };
    if (e) {
      this._GovernService.getDistricts(area).subscribe(res => {
        that.districts = res;
      });
    }
  }
  // 企业类型数据
  _getRoleType() {  // 企业类型数据，查询时使用
    const that = this;
    this._GovernService.getRoleType(this._CacheService.get('userId')).subscribe(res => {
      that.conpanyNameData = res;
    });
  }
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  // 导出文件
  _outFile(params) {
    const arr = [];
    if (!params.typeIds) {
      params.typeIds = [];
    }
    for (let i = 0; i < this.selects.length; i++) {
      arr.push(this.selects[i].remark);
    }
    const exportParm = {
      userId: this._CacheService.get('userId'),
      exportTitles: arr,
      ...params
    };
    this._GovernService.outFile(exportParm).subscribe(data => {
      const blob = new Blob([data], { 'type': 'application/vnd.ms-excel' });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', '一企一档');
      a.click();
    });
  }
  // 获取自定义列
  _getDataList(params) {
    const options = {
      'pageNumber': this.pageIndex,
      'pageSize': this.pageSize,
      'userId': this._CacheService.get('userId'),
      ...params
    };
    this.isloading = true;
    this._GovernService.getDataList(options).subscribe(res => {
      this.isloading = false;
      this.govColumn = res.customField;
      this.total = res.pageTotal,
        this.pagesCount = res.pagesCount,
        this.rowSelectionTable = res.enterpriseList;
      this.initSelects(this.govColumn);
    });
  }
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
  }
  refreshStatus(e): void {
    if (e) {
      this.pageIndex = e;
      this._getDataList(this.searchForm.value);
    }
  }
  searchData(reset: boolean = false): void {
    console.log(this.pageSize);
    if (reset) {
      this.pageIndex = 1;
    }
    this._getDataList(this.searchForm.value);
  }
  // 企业报告
  baogao(e) {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  // 工作台账
  remark(item, url = 'workspace') {
    this.isVisible1 = true;
    let companyId;
    let enterInfo;
    let companyName;
    for (let i = 0; i < this.rowSelectionTable.length; i++) {
      if (item[0] === this.rowSelectionTable[i].name) {
        companyId = this.rowSelectionTable[i].id;
        enterInfo = this.rowSelectionTable[i];
      }
      companyName = item[0];
      console.log(companyName);
    }
    this.width = 1400;
    if (item[11] === '暂无') {
      enterInfo.checkType = '暂无';
    }
    if (item[11].indexOf('整改') !== -1) {
      enterInfo.checkType = 'GovWorkType1';
    }
    if (item[11].indexOf('退出') !== -1) {
      enterInfo.checkType = 'GovWorkType2';
    }
    if (item[11] === '风险处置') {
      enterInfo.checkType = 'GovWorkType3';
    }
    this.router.navigate(['./' + url], {
      relativeTo: this.activeRoute,
      queryParams: { companyName: companyName, checkType: enterInfo.checkType, companyId: companyId }
    });
  }
  clickT() {
    this.clickFlag = false;
    this.width = 1400;
  }
  handleOk1(): void {
    this.isVisible1 = false;
    this.router.navigate(['/main/govern/oneCompanyOneFile'], { relativeTo: this.activeRoute });
    this.width = 700;
  }
  handleCancel1(): void {
    this.handleOk1();
  }
  edit(item) {
    this.remark(item, 'edit');
    this.isVisible1 = false;
  }
  toDetail(item) {
    let id = '';
    for (let i = 0; i < this.rowSelectionTable.length; i++) {
      if (item[0] === this.rowSelectionTable[i].name) {
        id = this.rowSelectionTable[i].id;
      }
    }
    this.router.navigate(['./detail'], {
      relativeTo: this.activeRoute,
      queryParams: { companyId: id, userId: this._CacheService.get('userId') }
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    clearInterval(this.time);
  }

}
