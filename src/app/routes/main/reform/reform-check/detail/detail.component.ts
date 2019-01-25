import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReformService } from '../../reform.service';
import { CacheService } from '../../../../../core/cache/cache.service';
import { UploadXHRArgs, NzMessageService } from 'ng-zorro-antd';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  id;
  currentForm: any = '1';
  dataSetFirst: any = [];
  dataSetSecond: any = [];
  entInfo: any;
  listTab: any;
  datas: any;
  // 当前角色
  isGov: any = this.http.isGov();
  isAccount: any = this.http.isAccout();
  isLawyer: any = this.http.isLawyer();
  isTrial: any = this.http.isTrial();
  // 108提交参数
  reformCommitParams: any = {
    first: null,
    second: [],
    third: null
  };
  // 文件查看弹窗
  isVisible1 = false;
  isVisible2 = false;
  isConfirmLoading = false;
  itemFiles: any = [];
  upfiles: any = [];
  // 文件上传
  uploadUrl;
  only = false;
  fileType: string;
  fileList = [];
  progress = 0;
  complianceCheckConfig: any;
  flag0 = true;
  flag1 = true;
  flag2 = true;
  flag3 = true;
  flag4 = true;
  flag5 = true;
  flag6 = true;
  constructor(public activatedRoute: ActivatedRoute,
    private msg: NzMessageService, private http: ReformService, private cache: CacheService,
    private route: Router,
    private activeRouter: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.cache.get('complianceCheckConfig'));
    this.complianceCheckConfig = this.cache.get('complianceCheckConfig');

    if (this.complianceCheckConfig && this.complianceCheckConfig.length > 0) {
      if (this.complianceCheckConfig[0].visible === '0') {
        this.flag0 = true;
        this.currentForm = '1';
      } else {
        this.flag0 = false;
        this.currentForm = '2';
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

    this.id = this.activatedRoute.snapshot.queryParams['id'];
    this.only = this.activatedRoute.snapshot.queryParams['only'];
    this.http.getEntInfo(this.id).subscribe(res => {
      this.entInfo = res;
      // console.log(res);
    });
    this.http.getRequsetion(this.id).subscribe(res => {
      this.dataSetFirst = res;
    });
    this.http.getTab(this.id).subscribe(res => {
      this.listTab = res;
      this.getTabDetial(this.listTab[0].val);
    });
    this.findReformMessage();
  }

  getTabDetial(val) {
    const params = {
      'enterpriseMsgId': this.id,
      'status': '1',
      'userId': this.cache.get('UserId'),
      'res0': val
    };
    this.http.getTabDetail(params).subscribe((res: any) => {
      this.dataSetSecond = res;
    });
  }
  // 文件上传
  upload(type) {
    this.isVisible2 = true;
    this.fileType = type;
    this.findUploaded();
  }

  findUploaded() {
    this.http.findUploaded(this.id, this.fileType).subscribe((res: any) => {
      this.upfiles = res;
      console.log(res);
    });
  }

  getprogress = (p) => {
    this.progress = p.toFixed(0);
    if (p === 100) {
      this.findUploaded();
    }
  }

  change = (item) => {
    const that = this;
    this.http.reformFileUpload(item, that.id, that.fileType, this.getprogress);
  }

  delFile = (item) => {
    this.http.delUploadedFile(this.id, item.id).subscribe(() => {
      this.findUploaded();
    });
  }

  save() {
    this.reformCommitParams.second = this.datas;
    this.http.reformSave(this.id, this.reformCommitParams).subscribe(res => {
      this.msg.success('保存成功');
      this.route.navigate(['../'], { relativeTo: this.activeRouter });
    });
  }

  commit() {
    this.reformCommitParams.second = this.datas;
    console.log(this.reformCommitParams);
    this.http.reformCommit(this.id, this.reformCommitParams).subscribe(res => {
      this.msg.success('提交成功');
      this.route.navigate(['../'], { relativeTo: this.activeRouter });
    });
  }

  findReformMessage() {
    this.http.findReformMessage(this.id).subscribe((res: any) => {
      if (this.isGov) {
        this.reformCommitParams.first = res.govTrialRecommen;
      }
      if (this.isAccount) {
        this.reformCommitParams.first = res.accountTrialRecommen;
      }
      if (this.isLawyer) {
        this.reformCommitParams.first = res.lawyerTrialRecommen;
      }
      if (this.isTrial) {
        this.reformCommitParams.first = res.firstTrialRecommen;
        this.reformCommitParams.third = res.firstResult;
      }
      this.datas = res.checkVerifis;
      console.log(this.datas);
    });
  }
  // 文件查看弹窗
  showModal(item): void {
    this.isVisible1 = true;
    this.http.getItemFiles(this.id, item.dictId).subscribe(res => {
      this.itemFiles = res;
    });
  }

  handleOk(): void {
    this.isVisible1 = false;
    this.isVisible2 = false;
  }

  handleCancel(): void {
    this.isVisible1 = false;
    this.isVisible2 = false;
  }

  preview(url) {
    this.http.previewPDF(url);
  }
  checkedInput(item, e) {
    console.log(e.target.value);
    item.govVerificationCase = e.target.value;
    item.enterpriseMsgId = this.id;
  }
  checkedInput1(item, e) {
    console.log(e.target.value);
    item.firstVerificationCase = e.target.value;
    item.enterpriseMsgId = this.id;
  }
  checkedInput2(item, e) {
    console.log(e.target.value);
    item.lawyerVerificationCase = e.target.value;
    item.enterpriseMsgId = this.id;
  }
  checkedInput3(item, e) {
    console.log(e.target.value);
    item.accountVerificationCase = e.target.value;
    item.enterpriseMsgId = this.id;
  }

}
