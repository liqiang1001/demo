import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CacheService } from 'src/app/core/cache/cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DictService } from 'src/app/core/dict/dict.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { format } from 'date-fns';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-memorandum',
  templateUrl: './memorandum.component.html',
  styleUrls: ['./memorandum.component.less']
})
export class MemorandumComponent implements OnInit {
  searchForm: FormGroup;
  searchParams = [];
  displayData: any;
  pageIndex = 1;
  pageSize = 10;
  total: any;
  isloading: boolean;
  tableList: any;
  constructor(
    private fb: FormBuilder,
    private cache: CacheService,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private dict: DictService,
    private model: NzModalRef,
    private message: NzMessageService,
    private http: WorkspaceService
  ) { }

  ngOnInit() {
    console.log(this.model.getContentComponent().item);
    this.searchForm = this.fb.group({
      dataRange: [], // 时间段
    });
    this.getDataList(this.searchForm.value);
  }
  // 获取查询列表
  getDataList(params) {
    const list = {
      pageSize: this.pageSize,
      pageNumber: this.pageIndex,
      detailType: 'GovDLWorkType6',
      recordType: 'GovWorkType0',
      searchStart: this.searchForm.value.dataRange ? format(this.searchForm.value.dataRange[0], 'YYYY-MM-DD 00:00:00') : null,
      searchEnd: this.searchForm.value.dataRange ? format(this.searchForm.value.dataRange[1], 'YYYY-MM-DD 23:59:59') : null,
      publicityStatus: 1,
      enterId: this.model.getContentComponent().item
    };
    this.http.getSelectRecordList(list).subscribe((res: any) => {
      console.log(res);
      this.tableList = res.list;
      this.total = res.total;
    });
  }
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  // 分页
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
  }
  refreshStatus(e) {
    if (e) {
      this.pageIndex = e;
      this.getDataList(this.searchForm.value);
    }
  }
}
