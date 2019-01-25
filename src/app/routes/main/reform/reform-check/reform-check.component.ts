import { Component, OnInit } from '@angular/core';
import {
  FormGroup, FormBuilder, FormControl,
} from '@angular/forms';
import { DictService } from '../../../../core/dict/dict.service';
import { CacheService } from '../../../../core/cache/cache.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ReformService } from '../reform.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';

@Component({
  selector: 'app-reform-check',
  templateUrl: './reform-check.component.html',
  styleUrls: ['./reform-check.component.less']
})
export class ReformCheckComponent implements OnInit {
  // 字典
  reformState: any = [{ 'name': '审查中', 'id': 1 }, { 'name': '审查完成', 'id': 2 }];
  foundList;
  // 搜索表格
  searchForm: FormGroup;
  searchParams = [];
  // 搜索列表
  data: any;
  pageIndex: any;
  total: any;
  // 当前角色
  isGov: any = this.http.isGov();
  isAccount: any = this.http.isAccout();
  isLawyer: any = this.http.isLawyer();
  isTrial: any = this.http.isTrial();

  complianceCheckConfig: any;
  flag0 = true;
  flag1 = true;
  flag2 = true;
  flag3 = true;
  flag4 = true;
  flag5 = true;
  flag6 = true;
  menuList = [
    { id: 95, name: '审核', show: false },
    { id: 152, name: '详情', show: false },
  ];
  constructor(private dict: DictService,
    private cache: CacheService,
    private fb: FormBuilder,
    public http: ReformService,
    private route: Router,
    private menuHttp: DefaultService,
    private activeRouter: ActivatedRoute) { }

  ngOnInit() {
    this.getMenuAccess();
    console.log(this.cache.get('complianceCheckConfig'));
    this.complianceCheckConfig = this.cache.get('complianceCheckConfig');
    if (this.complianceCheckConfig && this.complianceCheckConfig.length > 0) {
      if (this.complianceCheckConfig[0].visible === '0') {
        this.flag0 = true;
      } else {
        this.flag0 = false;
      }
      if (this.complianceCheckConfig[1].visible === '0') {
        this.flag1 = true;
      } else {
        this.flag1 = false;
      }
      if (this.complianceCheckConfig[2].visible === '0') {
        this.flag2 = true;
      } else {
        this.flag2 = false;
      }
      if (this.complianceCheckConfig[3].visible === '0') {
        this.flag3 = true;
      } else {
        this.flag3 = false;
      }
      if (this.complianceCheckConfig[4].visible === '0') {
        this.flag4 = true;
      } else {
        this.flag4 = false;
      }
      if (this.complianceCheckConfig[5].visible === '0') {
        this.flag5 = true;
      } else {
        this.flag5 = false;
      }
      if (this.complianceCheckConfig[6].visible === '0') {
        this.flag6 = true;
      } else {
        this.flag6 = false;
      }
    }
    this.searchForm = this.fb.group({
      companysName: [''],
      status: [null],
      statusMark: [null],
      hasReform: [null],
      fundSize: [null]
    });
    this.http.getFundList().subscribe(res => {
      this.foundList = res;
    });
    // console.log(this.isAccount, this.isGov, this.isLawyer, this.isTrial);
    this.pageIndex = 1;
    this.getList();
  }
  // 判断按钮权限
  getMenuAccess() {
    this.activeRouter.queryParams.subscribe((params: Params) => {
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

  getList() {
    const that = this;
    this.http.getReformList({
      res0: this.searchForm.value.companysName,
      param2: this.searchForm.value.status,
      hasReform: this.searchForm.value.hasReform,
      statusMark: this.searchForm.value.statusMark,
      fundSize: this.searchForm.value.fundSize,
      pageNumber: that.pageIndex,
      pageSize: '10',
      userId: this.cache.get('userId')
    }).subscribe((res: any) => {
      this.data = res.tempList;
      this.total = res.pageTotal;
    });
  }

  resetForm() {
    this.searchForm.reset();
  }
  openDetail(id, read?: string) {
    if (read) {
      this.route.navigate(['./detail'], { relativeTo: this.activeRouter, queryParams: { id: id, only: true } });
    } else {

      this.route.navigate(['./detail'], { relativeTo: this.activeRouter, queryParams: { id: id } });
    }
  }


}
