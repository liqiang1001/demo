import { Component, OnInit } from '@angular/core';
import { DictService } from 'src/app/core/dict/dict.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RiskService } from '../risk.service';

@Component({
  selector: 'app-norm',
  templateUrl: './norm.component.html',
  styleUrls: ['./norm.component.less']
})
export class NormComponent implements OnInit {
  BI_IP = this.http.BI;
  token = sessionStorage.getItem('token');
  // 预警级别
  levelList = [{ 'label': '红色预警', 'value': 'a' }, { 'label': '黄色预警', 'value': 'b' }, { 'label': '橙色预警', 'value': 'c' }];
  // 搜索表格
  searchForm: FormGroup;
  // 搜索列表
  data: any;
  pageIndex: any = 1;
  total: any;
  constructor(private dict: DictService,
    private cache: CacheService,
    private fb: FormBuilder,
    public http: RiskService,
    private route: Router,
    private activeRouter: ActivatedRoute) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      orgName: [''],
      plaName: [null],
      updateTime: [null],
      createTime: [null],
      level: [ null ]
    });
    this.getList();
  }

  getList() {
    const that = this;
    console.log(this.searchForm.value);
    this.http.getWarningList({
      name: this.searchForm.value.orgName,
      plaName: this.searchForm.value.plaName,
      updateTime: this.searchForm.value.updateTime && this.searchForm.value.updateTime[0],
      createTime: this.searchForm.value.updateTime && this.searchForm.value.updateTime[1],
      level: this.searchForm.value.level,
      pageSize: '10',
      pageNumber: this.pageIndex
    }).subscribe((res: any) => {
      that.data = res.roleList;
      that.total = res.pageTotal;
    });
  }

  resetForm() {
    this.searchForm.reset();
    this.getList();
  }
}
