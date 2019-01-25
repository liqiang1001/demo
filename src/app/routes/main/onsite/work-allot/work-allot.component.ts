import { Component, OnInit } from '@angular/core';
import {
  FormGroup, FormBuilder, FormControl,
} from '@angular/forms';
import { OnsiteService } from '../onsite.service';
import { DictService } from '../../../../core/dict/dict.service';
import { CacheService } from '../../../../core/cache/cache.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DefaultService } from 'src/app/layout/default/default.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-work-allot',
  templateUrl: './work-allot.component.html',
  styleUrls: ['./work-allot.component.less']
})
export class WorkAllotComponent implements OnInit {
  // 字典
  properList: any; // 核查性质
  checkGroup: any; // 核查项组
  statusArr = [{ 'name': '未发布', 'value': 1 }, { 'name': '已发布', 'value': 2 }]; // 核查状态
  provinces: any;
  citys: any;
  districts: any;
  roads: any;
  // 搜索表格
  searchForm: FormGroup;
  searchParams = [];
  // 搜索列表
  allChecked = false;
  indeterminate = false;
  displayData = [];
  total: any;
  pageIndex = 1;
  pageSize = 10;
  data = [];
  checkList = [];
  isloading: boolean;
  menuList = [
    { id: 77, name: '创建任务', show: false },
    { id: 78, name: '发布任务', show: false },
    { id: 79, name: '删除', show: false },
  ];
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  constructor(private fb: FormBuilder,
    private cache: CacheService,
    private http: OnsiteService,
    private dict: DictService,
    private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.getMenuAccess();
    const that = this;
    this.properList = this.dict.get('check_proper');
    this.getProvince();
    this.getCheckGroup();
    this.dict.get('check_freq');
    this.dict.get('userType');
    this.searchForm = this.fb.group({
      provinceCode: [''],
      cityCode: [''],
      countyCode: [''],
      checkProper: [''],
      checkItemGroupId: [''],
      checkPersonsName: [''],
      companysName: [''],
      status: [''],
    });
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
    if (params.status === 2 || params.status === 1) {
      this.pageIndex = 1;
    }
    const listParams: any = {
      createUser: this.cache.get('userId'),
      userId: this.cache.get('userId'),
      pageSize: '10',
      pageNumber: this.pageIndex,
      ...params
    };
    this.isloading = true;
    this.http.getAllotList(listParams).subscribe((res: any) => {
      if (params.status === 1) {
        // console.log(res.tempList.filter(item => item.status === '1'));
        this.data = res.tempList.filter(item => item.status === '1');
        // this.total = this.data.length;

      } else if (params.status === 2) {
        // console.log(res.tempList);
        // console.log(res.tempList.filter(item => item.status === '2'));
        this.data = res.tempList.filter(item => item.status === '2');
        // this.total = this.data.length;
      } else {
        this.data = res.tempList;
        this.total = res.pageTotal;
      }
      this.isloading = false;
    });
  }
  // 分页
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus('');
  }
  // 刷新状态
  refreshStatus(e): void {
    if (e) {
      this.pageIndex = e;
      this.getList(this.searchForm.value);
    }
    for (const item of this.displayData.filter(value => value.status === '2')) {
      item.disabled = true;
    }
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    for (const item of this.displayData.filter(value => value.checked)) {
      this.checkList.push(item.taskId);
    }
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

  // 发布任务
  publishJob(e): void {
    if (e) {
      this.http.postSelectedMission(e).subscribe(res => {
        this.message.success('任务发布成功');
        this.getList(this.searchForm.value);
      });
    } else {
      if (this.checkList.length !== 0) {
        this.http.postSelectedMission(this.checkList.join(',')).subscribe(res => {
          this.message.success('任务发布成功');
          this.getList(this.searchForm.value);
        });
      } else {
        this.message.error('请选择要发布的任务');
      }
    }
  }
  confirm(id): void {
    this.http.delgroupTemp(id).subscribe(res => {
      this.message.info('删除成功');
      this.getList(this.searchForm.value);
    });
  }

}
