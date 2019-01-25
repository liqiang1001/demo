import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from '../../../../core/cache/cache.service';
import { DictService } from '../../../../core/dict/dict.service';
import { ReformService } from '../reform.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';

@Component({
  selector: 'app-workallot-check',
  templateUrl: './workallot-check.component.html',
  styleUrls: ['./workallot-check.component.less']
})
export class WorkallotCheckComponent implements OnInit {
  // 搜索表格
  searchForm: FormGroup;
  searchParams = [];
  // 搜索列表

  total: any;
  pageIndex = 1;
  pageSize = 10;
  districts: any;
  isloading: boolean;
  displayData: any;
  entTypeOpts: any;
  flag1 = true;
  flag2 = true;
  flag3 = true;
  flag4 = true;
  flag5 = true;
  complianceCheckConfig: any;
  checkOption = [{ id: '0', name: '未分配' }, { id: '1', name: '审查中' }, { id: '2', name: '审查完成' }];
  menuList = [
    { id: 92, name: '创建', show: false },
    { id: 93, name: '核查档案', show: false },
  ];
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private cache: CacheService,
    private http: ReformService,
    private menuHttp: DefaultService,
    private activeRoute: ActivatedRoute,
    private dict: DictService) { }

  ngOnInit() {
    this.getMenuAccess();
    console.log(this.cache.get('complianceCheckConfig'));
    this.complianceCheckConfig = this.cache.get('complianceCheckConfig');
    if (this.complianceCheckConfig && this.complianceCheckConfig.length > 0) {
      this.flag1 = this.complianceCheckConfig[1].visible === '0';
      this.flag2 = this.complianceCheckConfig[2].visible === '0';
      this.flag3 = this.complianceCheckConfig[3].visible === '0';
      this.flag4 = this.complianceCheckConfig[4].visible === '0';
      this.flag5 = this.complianceCheckConfig[5].visible === '0';
    }
    this.getDistricts();
    // this.entTypeOpts = this.dict.get('userType');
    this.getenterType();
    this.searchForm = this.fb.group({
      countyCode: [''],
      companyName: [''],
      firstTrialStatus: [''],
      accountTrialStatus: [''],
      lawyerTrialStatus: [''],
      govTrialStatus: [''],
      typeIds: [''],
      auditResult: [''],  // 合规委员会结果
    });
    this.getDataList(this.searchForm.value);
  }
  // 获取企业类型列表
  getenterType() {
    this.http.getenterType(this.cache.get('userId')).subscribe((res: any) => {
      console.log(res);
      this.entTypeOpts = res;
    });
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
  // 获取区列表
  getDistricts() {
    this.http.getDistricts('').subscribe((res: any) => {
      this.districts = res[0].children[0].children;
    });
  }
  resetForm() {
    this.searchForm.reset();
  }
  getDataList(params) {
    this.isloading = true;
    const paramsList = {
      res0: params.companyName, // 企业名称
      res1: params.countyCode, // 企业所在区
      res2: '', // 初审结果
      res3: '', // 现场检查结果
      res8: '',
      typeIds: params.typeIds,
      firstTrialStatus: params.firstTrialStatus,
      accountTrialStatus: params.accountTrialStatus,
      lawyerTrialStatus: params.lawyerTrialStatus,
      govTrialStatus: params.govTrialStatus,
      auditResult: params.auditResult, // 合规委员会结果
      listRecommen: 'string',
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      status: '1',
      userId: this.cache.get('userId')
    };
    this.http.getAllocationList(paramsList).subscribe((res: any) => {
      // console.log(res);
      this.isloading = false;
      this.total = res.pageTotal;
      this.displayData = res.tempList;
    });
  }
  // 刷新分页
  refreshStatus(e) {
    if (e) {
      this.pageIndex = e;
      this.getDataList(this.searchForm.value);
    }
  }
  createForm() {
    this.router.navigate(['./create']);
  }
  // 档案详情
  go_dangan(id, index) {
    this.router.navigate(['./detail'], { relativeTo: this.activeRoute, queryParams: { id: id, index: index } });
  }
}
