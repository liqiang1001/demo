import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OnsiteService } from '../onsite.service';
import { DefaultService } from 'src/app/layout/default/default.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clue-submission',
  templateUrl: './clue-submission.component.html',
  styleUrls: ['./clue-submission.component.less']
})
export class ClueSubmissionComponent implements OnInit {
  // 字典
  // 线索状态
  statusArr = [{ 'name': '无需关注', 'value': '0' },
  { 'name': '严重', 'value': '2' }, { 'name': '一般', 'value': '1' }, { 'name': '全部', 'value': '' }];
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
  menuList = [
    { id: 136, name: '详情', show: false },
  ];
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  constructor(private fb: FormBuilder, private http: OnsiteService, private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute, ) { }

  ngOnInit() {
    this.getMenuAccess();
    this.searchForm = this.fb.group({
      provinceCode: [''],
      cityCode: [''],
      countyCode: [''],
      companyName: [''],
      createUser: [''],
      threadLevel: [''],
    });
    this.getProvince();
    this.getList(this.searchForm.value);
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
      pageSize: this.pageSize,
      pageNumber: this.pageIndex,
      ...params
    };
    this.isloading = true;
    this.http.getClueList(listParams).subscribe((res: any) => {
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
      this.getList(this.searchForm.value);
    }
  }

}
