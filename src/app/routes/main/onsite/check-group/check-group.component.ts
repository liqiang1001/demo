import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from '../../../../core/cache/cache.service';
import { OnsiteService } from '../onsite.service';
import { DictService } from '../../../../core/dict/dict.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Params, ActivatedRoute } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';

@Component({
  selector: 'app-check-group',
  templateUrl: './check-group.component.html',
  styleUrls: ['./check-group.component.less']
})
export class CheckGroupComponent implements OnInit {
  // 搜索表格
  searchForm: FormGroup;
  searchParams = [];
  // 搜索列表
  displayData = [];
  total: any;
  pageIndex = 1;
  pageSize = 10;
  data = [];
  isloading: boolean;
  // 创建核查项
  createForm: FormGroup;
  isVisible = false;
  isConfirmLoading = false;
  // 核查项选项
  CheckOptions: any;
  menuList = [
    { id: 89, name: '创建核查项组', show: false },
    { id: 90, name: '删除', show: false },
  ];
  constructor(
    private nzMessageService: NzMessageService,
    private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder, private cache: CacheService,
    private http: OnsiteService, private dict: DictService) { }

  ngOnInit() {
    this.getMenuAccess();
    this.searchForm = this.fb.group({
      checkItemGroupName: [''],
      res0: ['']
    });
    this.createForm = this.fb.group({
      checkItemGroupName: [''],
      res0: [null],
      option: [''],
    });
    this.getCheckOption();
    this.getList(this.searchForm.value);
  }
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
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
  // 获取核查项组列表
  getList(params) {
    this.isloading = true;
    const listParams: any = {
      createUser: this.cache.get('userId'),
      userId: this.cache.get('userId'),
      pagenum: this.pageIndex,
      pageSize: this.pageSize,
      pageNumber: this.pageIndex,
      ...params
    };
    this.http.getCheckGroupList(listParams).subscribe((res: any) => {
      this.data = res.groupList;
      this.total = res.pageTotal;
      this.isloading = false;

    });
  }
  // 创建核查项
  showModal(): void {
    this.isVisible = true;
  }

  // 获取核查项选项
  getCheckOption() {
    this.http.getCheckOptions().subscribe(res => {
      this.CheckOptions = res;
    });
  }
  // 选择核查项组
  selectCheckOpiton(res) {
    this.createForm.patchValue({ res0: res });
  }

  handleOk(value): void {
    this.isConfirmLoading = true;
    if (!value.checkItemGroupName) {
      this.nzMessageService.error('请填写核查项组名！');
      this.isConfirmLoading = false;
      return;
    }
    if (!value.res0) {
      this.nzMessageService.error('请选择核查项！');
      this.isConfirmLoading = false;
      return;
    }
    // console.log(value);
    const params = {
      'status': '1',
      'res0': value.res0.join(','),
      'checkItemGroupName': value.checkItemGroupName,
      'createTime': new Date(),
      'createUser': this.cache.get('userInfo')['name'],
      'userId': this.cache.get('userId')
    };
    this.http.postCheckOptions(params).subscribe(res => {
      // console.log(res);
      if (res === 1) {
        this.nzMessageService.success('创建成功！');
      } else if (res === 2) {
        this.nzMessageService.error('核查项组名称已存在！');
      }
      this.isVisible = false;
      this.createForm.reset();
      this.isConfirmLoading = false;
      this.getList(this.searchForm.value);
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.createForm.reset();
  }

  // 删除单条
  cancel(): void {
  }

  confirm(id): void {
    this.http.delCheckOptions(id).subscribe(res => {
      this.nzMessageService.info('删除成功');
      this.getList(this.searchForm.value);
    });
  }

  // 分页
  refreshStatus(e) {
    if (e) {
      this.pageIndex = e;
      this.getList(this.searchForm.value);
    }
  }
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
  }
}
