import { Component, OnInit } from '@angular/core';
import { DictService } from 'src/app/core/dict/dict.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RiskService } from '../risk.service';

@Component({
  selector: 'app-illegal',
  templateUrl: './illegal.component.html',
  styleUrls: ['./illegal.component.less']
})
export class IllegalComponent implements OnInit {
  // 搜索表格
  searchForm: FormGroup;
  BI_IP = this.http.BI;
  token = sessionStorage.getItem('token');
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
      createTime: [null]
    });
    this.getList();
  }

  getList() {
    const that = this;
    console.log(this.searchForm.value);
    this.http.getIllegalList({
      orgName: this.searchForm.value.orgName,
      plaName: this.searchForm.value.plaName,
      updateTime: this.searchForm.value.updateTime && this.searchForm.value.updateTime[0],
      createTime: this.searchForm.value.updateTime && this.searchForm.value.updateTime[1],
      pageSize: '10',
      pageNumber: this.pageIndex
    }).subscribe((res: any) => {
      res.roleList.forEach(item => {
        let type, arr;
        try {
          type = item.riskType.split(',');
          arr = item.riskBy.split(',,');
        } catch (err) {
          type = [item.riskType];
          arr = [item.riskBy];
        }

        const accord = [];
        for (let i = 0; i < type.length; i++) {
          let temp;
          try {
            temp = arr[i].split(',');
          } catch (err) {
            temp = [arr[i]];
          }
          accord.push(temp);
        }
        item['type'] = type;
        item['accord'] = accord;
      });
      that.data = res.roleList;
      that.total = res.pageTotal;
    });
  }

  resetForm() {
    this.searchForm.reset();
    this.getList();
  }
}
