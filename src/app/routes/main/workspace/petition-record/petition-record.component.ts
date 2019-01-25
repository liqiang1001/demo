import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { CacheService } from 'src/app/core/cache/cache.service';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-petition-record',
  templateUrl: './petition-record.component.html',
  styleUrls: ['./petition-record.component.less']
})
export class PetitionRecordComponent implements OnInit {
  displayData: any;
  pageNum = 1;
  pageSize = 10;
  total: any;
  isloading: boolean;
  tableList: any;
  constructor(private model: NzModalRef, private cache: CacheService,
    private http: WorkspaceService, ) { }

  ngOnInit() {
    this.getDataList();
  }

  getDataList() {
    const list = {
      pageSize: this.pageSize,
      pageNum: this.pageNum,

    };
    this.isloading = true;
    this.http.getVisitorsList(list).subscribe((res: any) => {
      console.log(res);
      if (!res.code) {
        this.isloading = false;
        this.total = res.total;
        this.tableList = res.list;
      }
    });
  }
  refreshStatus(e) {
    console.log(e);
    if (e) {
      this.pageNum = e;
      this.getDataList();
    }
  }
  // 分页
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus('');
  }
  searchData(reset: boolean = false): void {
    console.log(this.pageSize);
    if (reset) {
      this.pageNum = 1;
    }
    this.getDataList();
  }
  // 处理
  process(item) {
    this.model.destroy(item);
  }
  // 关闭模态框
  handleCancel() {
    this.model.destroy();
  }
}
