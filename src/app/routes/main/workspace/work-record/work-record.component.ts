import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkspaceService } from '../workspace.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { format } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-work-record',
  templateUrl: './work-record.component.html',
  styleUrls: ['./work-record.component.less']
})
export class WorkRecordComponent implements OnInit {
  // 字典
  // 类型
  searchType: any;
  // 搜索表格
  searchForm: FormGroup;
  searchParams = [];
  // 搜索列表
  indeterminate = false;
  total: any;
  pageIndex = 1;
  pageSize = 10;
  isloading: boolean;
  data: any = [];
  listType;
  DLtype;
  VIP;
  userId;
  constructor(private fb: FormBuilder,
    private activeRoute: ActivatedRoute, private http: WorkspaceService, private cache: CacheService, private msg: NzMessageService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.listType = params.type;
      this.DLtype = params.dlType;
    });
    this.searchForm = this.fb.group({
      summary: [],
      local: [],
      person: [],
      dataRange: [],
      type: [this.listType],
      companyName: [],
      showAll: [false]
    });
    this.userId = this.cache.get('userId');
    this.VIP = this.cache.get('userData').userRecordSee * 1;
    // this.VIP = 1;
    this.getList();
  }

  getList() {
    const params: any = {
      operatorId: this.cache.get('userId')
    };
    params.summary = this.searchForm.value.summary;
    params.workPlace = this.searchForm.value.local;
    params.searchStart = this.searchForm.value.dataRange ? format(this.searchForm.value.dataRange[0], 'YYYY-MM-DD 00:00:00') : null;
    params.searchEnd = this.searchForm.value.dataRange ? format(this.searchForm.value.dataRange[1], 'YYYY-MM-DD 23:59:59') : null;
    params.detailType = this.listType;
    params.recordType = this.DLtype;
    params.enterName = this.searchForm.value.companyName;
    params.participator = this.searchForm.value.person;
    // if (this.VIP === 1 && !this.searchForm.value.showAll) {
    //   params.operatorId = null;
    // }
    params.seeSelf = this.searchForm.value.showAll ? 1 : 0;
    this.http.getRecordList({
      'pageSize': 10,
      'pageNumber': this.pageIndex,
      ...params
    }).subscribe((res: any) => {
      this.data = res.list;
      this.total = res.total;
    });
  }

  delRecordItem(id) {
    this.http.delRecordItem(id).subscribe(res => {
      this.msg.success('删除成功');
      this.getList();
    });
  }

  resetForm() {
    this.searchForm.reset();
    this.searchForm.patchValue({
      type: this.listType
    });
  }
  changePage(e) {
    this.pageIndex = e;
    this.getList();
  }
}
