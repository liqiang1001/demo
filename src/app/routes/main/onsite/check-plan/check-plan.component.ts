import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from '../../../../core/cache/cache.service';
import { OnsiteService } from '../onsite.service';
import { DictService } from '../../../../core/dict/dict.service';
import { Params, ActivatedRoute } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';

@Component({
  selector: 'app-check-plan',
  templateUrl: './check-plan.component.html',
  styleUrls: ['./check-plan.component.less']
})
export class CheckPlanComponent implements OnInit {
  // 字典
  checkGroup: any; // 核查项组
  properList: any; // 核查性质
  statusArr = [{ 'name': '未发布', 'value': 1 }, { 'name': '已发布', 'value': 2 }]; // 核查状态
  provinces: any;
  citys: any;
  districts: any;
  roads: any;
  // 搜索表格
  searchForm: FormGroup;
  searchParams = [];
  // 搜索列表
  indeterminate = false;
  displayData = [];
  total: any;
  pageIndex = 1;
  pageSize = 10;
  isloading: boolean;
  data: any;
  // 核查进度详情弹框
  checkDetailForm: FormGroup;
  checkDetailTableList: any;
  allChecked = false;
  indeterminate2 = false;
  isVisible: boolean;
  taskId: '';
  roleTypes: any = [
    { 'id': '0', 'name': '核查中' },
    { 'id': '1', 'name': '待核查' },
    { 'id': '2', 'name': '已核查' }
  ];
  menuList = [
    { id: 82, name: '详情', show: false },
  ];
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  constructor(private fb: FormBuilder,
    private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute,
    private cache: CacheService, private http: OnsiteService, private dict: DictService) { }

  ngOnInit() {
    this.getMenuAccess();
    this.properList = this.dict.get('check_proper');
    this.getProvince();
    this.getCheckGroup();
    this.getList({});
    this.searchForm = this.fb.group({
      provinceCode: [''],
      cityCode: [''],
      countyCode: [''],
      groupName: [''],
      status: [''],
    });
    // taskId: [], // 公司 id

    this.checkDetailForm = this.fb.group({
      checkPerson: [''],
      statue: [''],
      companyName: ['']
    });
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
              if (list.indexOf(item.id) > -1) {
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
  // 获取核查项组
  getCheckGroup() {
    this.http.getCheckGroup({
      'createUser': this.cache.get('userId'),
      'userId': this.cache.get('userId')
    }).subscribe(res => this.checkGroup = res);
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
  // 获取街道
  getRoads(e) {
    if (e) {
      this.http.getRoads(e).subscribe(res => {
        this.roads = res;
      });
    }
  }
  // 查询列表
  getList(params) {
    const listParams: any = {
      createUser: this.cache.get('userId'),
      userId: this.cache.get('userId'),
      pageSize: this.pageSize,
      pageNumber: this.pageIndex,
      ...params
    };
    this.isloading = true;
    this.http.getCheckPlan(listParams).subscribe((res: any) => {
      this.data = res.tempList;
      this.total = res.pageTotal;
      this.isloading = false;
    });
  }
  // 分页
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
  }
  changePage(e) {
    if (e) {
      this.pageIndex = e;
      this.getList({});
    }
  }

  // 核查进度详情
  check(params, id) {
    this.isVisible = true;
    this.taskId = id;
    this.checkDetail(params, id);
  }
  checkDetail(params, id) {
    const listParams: any = {
      taskId: id,
      pageSize: 100000000,
      pageNumber: 1,
      ...params
    };
    this.http.getCheckResultList(listParams).subscribe((res: any) => {
      this.checkDetailTableList = res.tempList;
    });
  }
  // 关闭弹框
  handleCancel(): void {
    this.isVisible = false;
  }
  close(): void {
    this.isVisible = false;
  }
  // 全选
  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }
  // 刷新状态
  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate2 = (!allChecked) && (!allUnChecked);
  }
  // 通知
  inform(e): void {

  }

}
