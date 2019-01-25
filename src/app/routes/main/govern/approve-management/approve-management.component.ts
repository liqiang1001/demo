import { Component, OnInit } from '@angular/core';
import { GovernService } from '../govern.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DictService } from 'src/app/core/dict/dict.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DefaultService } from 'src/app/layout/default/default.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-approve-management',
  templateUrl: './approve-management.component.html',
  styleUrls: ['./approve-management.component.less']
})
export class ApproveManagementComponent implements OnInit {
  searchForm: FormGroup;
  searchParams = [];
  data = [];
  total;
  pageIndex = 0;
  statusOptions;
  resultOptions;
  isVisible = false;
  indeterminate = false;
  isShow = true;
  allChecked = false;
  currentItem = {
    auditResult: '',
    remark: '',
    idList: []
  };
  menuList = [
    { id: 38, name: '批量审批', show: false },
    { id: 39, name: '详情', show: false },
  ];
  constructor(private fb: FormBuilder,
    private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute,
    private http: GovernService, private dict: DictService, private cache: CacheService, private msg: NzMessageService) { }

  ngOnInit() {
    this.getMenuAccess();
    this.searchForm = this.fb.group({
      auditResult: [null],
      auditStatus: [null],
      entName: [null],
      Time: [null],
      requestChangeInfo: [null]
    });
    this.statusOptions = this.dict.get('auditStatus');
    this.resultOptions = this.dict.get('auditResult');
    this.getDataList(this.searchForm.value);
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
  getDataList(value) {
    const params = {
      ...value,
      pageNumber: this.pageIndex,
      minTime: value.Time && value.Time[0],
      maxTime: value.Time && value.Time[1],
      pageSize: 10,
      userId: this.cache.get('userId')
    };
    this.http.getChangeList(params).subscribe((res: any) => {
      this.data = res.userList;
      this.total = res.pageTotal;
      console.log(res.userList);
    });
  }
  resetForm() {
    this.searchForm.reset();
  }

  changePage(e) {
    this.pageIndex = e;
    this.getDataList(this.searchForm.value);
    console.log(e);
  }

  checkAll(event) {
    console.log(event);
    this.data.forEach(item => {
      if (item.auditStatus === 0) {
        item.checked = event;
      }
    });
    this.refreshStatus();
  }

  checkDetail(item) {
    this.isVisible = true;
    this.isShow = item.auditStatus === 1;
    this.currentItem = {
      remark: item.remark,
      auditResult: item.auditResult,
      idList: [item.id]
    };
    console.log(item);
  }

  multAudit() {
    this.isVisible = true;
    this.isShow = false;
    this.refreshStatus();
  }

  refreshStatus() {
    const multdata = this.data.filter(item => {
      return item.checked === true;
    }).map((unit: any) => {
      return unit.id;
    });
    this.currentItem.idList = multdata;
  }

  handleOk(): void {
    this.isVisible = false;
    this.commitChange();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isShow = false;
    this.currentItem.auditResult = '';
    this.currentItem.remark = '';
  }

  commitChange() {
    const params: any = { ...this.currentItem };
    params.userId = this.cache.get('userId');
    console.log(params);
    this.http.auditChange(params).subscribe(res => {
      this.msg.success('审核成功');
      this.getDataList(this.searchForm.value);
    });
  }
}
