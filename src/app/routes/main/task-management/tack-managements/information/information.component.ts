import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from 'src/app/core/cache/cache.service';
import { TackMangementService } from '../../tack-mangement.service';
import { DictService } from 'src/app/core/dict/dict.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.less']
})
export class InformationComponent implements OnInit {
  searchForm: FormGroup;
  searchParams = [];
  conpanyNameData: any;
  // 搜索表格

  allChecked = false;
  indeterminate = false;
  displayData = [];
  total: any;
  pageIndex = 1;
  pageSize = 10;
  data = [];
  id: any;
  checkList = [];
  isloading: boolean;
  enterpriseIdList = [];
  // 添加
  isVisible: boolean;
  itemData = [];
  addenterpriseIdList = [];
  constructor(private fb: FormBuilder, private cache: CacheService,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private message: NzMessageService,
    private http: TackMangementService, private dict: DictService) { }

  ngOnInit() {
    this.conpanyNameData = this.dict.get('userType');
    this.activeRoute.queryParams.subscribe((params) => {
      this.id = params.id;
    });
    this.searchForm = this.fb.group({
      name: [''],
      registrationNumber: [''],
      typeIds: []
    });
    this.getList(this.searchForm.value);
  }
  // 获取表格数据
  getList(params) {
    if (params.typeIds) {
      params.typeIds = params.typeIds.join(',');
    }
    const list = {
      creditCode: params.registrationNumber,
      enterpriseName: params.name,
      enterpriseTypeValue: params.typeIds,
      id: this.id,
      pageNumber: this.pageIndex,
      pageSize: this.pageSize
    };
    this.http.getEnterpriseList(list).subscribe((res: any) => {
      this.data = res.userList;
      this.total = res.pageTotal;
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
      this.enterpriseIdList.push(item.id);
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
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  // 删除
  delete() {
    if (this.enterpriseIdList.length > 0) {
      const list = {
        id: this.id,
        enterpriseIdList: this.enterpriseIdList
      };
      this.http.batchDelEnterprise(list).subscribe((res: any) => {
        this.message.success('删除成功');
        this.getList(this.searchForm.value);
      });
    } else {
      this.message.error('请选择要删除的项！');
      return;
    }

  }
  // 添加
  add() {
    this.http.addTask(this.id).subscribe((res: any) => {
      this.itemData = res;
      this.isVisible = true;
    });
  }
  handleOk() {
    this.isVisible = false;
    const list = {
      id: this.id,
      enterpriseIdList: this.addenterpriseIdList
    };
    this.http.addEnterprise(list).subscribe(res => {
      this.message.success('添加成功');
      this.getList(this.searchForm.value);
    });
  }
  handleCancel() {
    this.isVisible = false;
  }
  selectCheckOpiton(e) {
    this.addenterpriseIdList = e;
  }


}
