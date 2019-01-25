import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { DictService } from '../../../../../core/dict/dict.service';
import { ReformService } from '../../reform.service';
import { CacheService } from '../../../../../core/cache/cache.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-workallot-detail',
  templateUrl: './workallot-detail.component.html',
  styleUrls: ['./workallot-detail.component.less']
})
export class WorkallotDetailComponent implements OnInit {
  btn_type: any = '1';  // tab切换按钮
  tabList = [{ 'name': '协会', 'sort': '1' }, { 'name': '律师', 'sort': '2' }, { 'name': '会计', 'sort': '3' }, { 'name': '政府', 'sort': '4' }];
  btn_type2 = 2;
  urlType: any = ['reFirstTrial', 'reLawyerTrial', 'reAccountTrial', 'reGovTrial'];   // 108
  datas: any;
  lists: any;
  applyList: any;
  productId: any;
  listThree: any;
  baseIns: any = { 'name': '', 'adress': '' };
  detailFlag: any;
  type108: any;
  govTrialRecommon: any; // 政府
  lawyerTrialRecommon: any; // 律师
  accountTrialRecommon: any; // 会计
  firstTrialRecommen: any; // 初审
  firstResult: any;
  old_mark;
  // 备注
  isVisible = false;
  // 预览
  isVisible2 = false;
  file_lists: any; // 文件列表

  // 上传文件地址
  fileType: any;
  isVisible3 = false;
  file_lists2: any;
  progress = 0;
  file_depends: any;
  file_url: any;
  fileName = '未选择任何文件';
  fileList: any;
  upTypeList1 = ['xs_first', 'law_result', 'kj_result', 'p2p'];
  upTypeList2 = ['law_pencil', 'kj_pencil', 'online'];
  src = '';
  isSrc = false;
  goUrl: any;
  res0: any;
  tabsList: any;
  flag0 = true;
  flag1 = true;
  flag2 = true;
  flag3 = true;
  flag4 = true;
  flag5 = true;
  flag6 = true;
  complianceCheckConfig: any;
  constructor(
    private cache: CacheService,
    private http: ReformService,
    private dict: DictService,
    private message: NzMessageService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log(this.cache.get('complianceCheckConfig'));
    this.complianceCheckConfig = this.cache.get('complianceCheckConfig');

    if (this.complianceCheckConfig && this.complianceCheckConfig.length > 0) {
      this.flag0 = this.complianceCheckConfig[0].visible === '0';
      this.flag1 = this.complianceCheckConfig[1].visible === '0';
      this.flag2 = this.complianceCheckConfig[2].visible === '0';
      this.flag3 = this.complianceCheckConfig[3].visible === '0';
      this.flag4 = this.complianceCheckConfig[4].visible === '0';
      this.flag5 = this.complianceCheckConfig[5].visible === '0';
      this.flag6 = this.complianceCheckConfig[6].visible === '0';
      if (this.complianceCheckConfig[2].visible !== '0') {
        this.tabList.splice(this.tabList.findIndex(item => item.sort === '1'), 1);
      }
      if (this.complianceCheckConfig[3].visible !== '0') {
        this.tabList.splice(this.tabList.findIndex(item => item.sort === '2'), 1);
      }
      if (this.complianceCheckConfig[4].visible !== '0') {
        this.tabList.splice(this.tabList.findIndex(item => item.sort === '3'), 1);
      }
      if (this.complianceCheckConfig[5].visible !== '0') {
        this.tabList.splice(this.tabList.findIndex(item => item.sort === '4'), 1);
      }
    }
    this.btn_type = this.tabList[0].sort;
    this.activeRoute.queryParams.subscribe((params) => {
      this.productId = params.id || this.productId;
      this.detailFlag = params.index || this.detailFlag;  //  1  已审核  0未审核
    });
    this.getselectByMsgId(this.productId);
    this.type108 = this.urlType[this.btn_type - 1];
    this.getInspectMsg(this.type108);
    this.getFirstThreeReList();
    this.http.getTab(this.productId).subscribe((res: any) => {
      this.tabsList = res;
      this.res0 = res[0].val;
      this.getReListList();
    });
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  tabClick(data) {
    this.btn_type = data;
    console.log(this.btn_type);
    this.btn_type2 = 2;
    this.getInspectMsg(this.type108);
  }
  btnClick(index) {
    this.btn_type2 = index;
  }
  tabSelect(e) {
    this.res0 = e;
    this.getReListList();
  }
  // 108项表格
  getInspectMsg(item) {
    const enterpriseMsgId = {
      enterpriseMsgId: this.productId,
    };
    this.http.getInspectMsg(item, enterpriseMsgId).subscribe((res: any) => {
      // console.log(res);
      this.datas = res.checkVerifis;
      this.accountTrialRecommon = res.accountTrialRecommen;
      this.firstTrialRecommen = res.firstTrialRecommen;
      this.govTrialRecommon = res.govTrialRecommen;
      this.lawyerTrialRecommon = res.lawyerTrialRecommen;
      this.firstResult = res.firstResult;
    });
  }
  // 获取企业信息
  getselectByMsgId(id) {
    this.http.getselectByMsgId(id).subscribe((res: any) => {
      // console.log(res);
      this.baseIns = res;
    });
  }
  getFourReList() {
    const paramsList = {
      enterpriseMsgId: this.productId,
      status: '1',
      userId: this.cache.get('userId'),
    };
    this.http.getFourReList(paramsList).subscribe((res: any) => {
      // console.log(res);
      this.listThree = res;
    });
  }
  getFirstThreeReList() {
    const paramsList = {
      enterpriseMsgId: this.productId,
    };
    this.http.getFirstThreeReList(paramsList).subscribe((res: any) => {
      // console.log(res);
      this.applyList = res;
    });
  }
  // 资料
  getReListList() {
    const paramsList = {
      enterpriseMsgId: this.productId,
      res0: this.res0,
      status: '1',
      userId: this.cache.get('userId'),
    };
    this.http.getReListList(paramsList).subscribe((res: any) => {
      // console.log(res);
      this.lists = res;
    });
  }
  // 受理申请书
  ApplyCheck() {
  }
  //  预览
  checkAlert(listId, msgId, status_now) {
    this.isVisible2 = true;
    this.checkFileslist(listId, msgId);
    // console.log(listId, msgId, status_now);
  }
  // 获取文件列表
  checkFileslist(listId, msgId) {
    const paramsList = {
      enterpriseMsgId: msgId,
      dictId: listId,
      status: '1',
      userId: this.cache.get('userId'),
    };
    this.http.checkFileslist(paramsList).subscribe((res: any) => {
      // console.log(res);
      this.file_lists = res;

    });
  }
  lookFile(id, fileName) {
    if (new RegExp('jpg').test(fileName) || new RegExp('png').test(fileName)) {
      this.isSrc = true;
      this.src = environment.SERVER_URL + '/upload-file/downloadPreview/' + id;
    } else if (new RegExp('txt').test(fileName)) {
      this.http.previewPNG(id).subscribe((res: any) => {
        const blob = new Blob([res], { type: '' });
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl);
      });
    } else if (new RegExp('rar').test(fileName) || new RegExp('zip').test(fileName)) {
      this.download(id, fileName);
    } else {
      this.http.previewPDF(id);
    }
  }
  handleOk1(): void {
    this.isVisible2 = false;
  }
  handleCancel1(): void {
    this.isVisible2 = false;
  }
  fileAlerts(strs) {
    console.log(strs);
    this.isVisible3 = true;
    this.fileType = strs;
    this.findUploaded();
  }
  findUploaded() {
    this.http.findUploaded(this.productId, this.fileType).subscribe((res: any) => {
      this.file_lists2 = res;
    });
  }
  download(id, name) {
    const uA = window.navigator.userAgent;
    const isIE = /msie\s|trident\/|edge\//i.test(uA) && !!('uniqueID' in document ||
      'documentMode' in document || ('ActiveXObject' in window) || 'MSInputMethodContext' in window);
    this.http.fileDownLoad(id).subscribe((data: any) => {
      const blob = new Blob([data], { type: '' });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = name;
      document.body.appendChild(a);
      a.setAttribute('id', 'download');
      if (isIE) {
        // 兼容IE11无法触发下载的问题
        // navigator.msSaveBlob(blob, fileName);
      } else {
        a.click();
      }
      // 触发下载后再释放链接
      a.addEventListener('click', function () {
        URL.revokeObjectURL(objectUrl);
        document.getElementById('download').remove();
      });
    });
  }
  handleOk2(): void {
    this.isVisible3 = false;
  }
  handleCancel2(): void {
    this.isVisible3 = false;
  }
  getprogress = (p) => {
    this.progress = p.toFixed(0);
    if (p === 100) {
      this.findUploaded();
    }
  }
  click_fileUp = (item) => {
    this.http.reformFileUpload(item, this.productId, this.fileType, this.getprogress);
  }
  ReAccessoryList(fileDepend) {
    const paramsList = {
      enterpriseMsgId: this.productId,
      fileDepend: fileDepend
    };
    this.http.ReAccessoryList(paramsList).subscribe((res: any) => {
      this.file_lists2 = res;
    });
  }
  // 备注
  remark(e) {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
  }
  closeImg() {
    this.isSrc = false;
    this.src = '';
  }

}
