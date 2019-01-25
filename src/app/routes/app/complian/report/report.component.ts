import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComplianService } from '../complian.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { UploadXHRArgs, NzModalRef, NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { HttpRequest, HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'ent-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {
  TabConfig;
  Tab;
  Tabs = [];
  nzTabPosition = 'top';
  selectedIndex = 0;
  CheckSelfInfo = [];
  CurrentUpload;
  remark = '';
  OtherTabDetailTable = [];
  IsCheckSelf = true;
  tplModal: NzModalRef;
  tplModalButtonLoading = false;
  FileList = [];
  showBadge = false;
  constructor(private http: ComplianService, private cache: CacheService,
    private modalService: NzModalService, private msg: NzMessageService,
    private route: Router) { }
  log(args: any[]): void {

  }
  ngOnInit() {
    this.TabConfig = this.cache.get('complianceCheckConfig').some((item) => {
      return (item.name === '自查报告' && item.visible === '0');
    });
    this.IsCheckSelf = this.TabConfig;
    this.getFormTab();
    if (this.TabConfig) {
      this.getCheckSelf();
    }
  }

  getFormTab() {
    this.http.getEnterTab().subscribe((res: any) => {
      if (this.TabConfig) {
        this.Tabs = [{ 'name': '自查报告', 'val': 'number_one', 'sort': '0', 'num': ' ' }, ...res];
      } else {
        this.Tabs = res;
      }
    });
  }
  // 获取自查报告
  getCheckSelf() {
    this.http.getFourReList().subscribe((res: any) => {
      this.CheckSelfInfo = res.map(data => {
        if (data.res1 === '自查报告（word文字版）') {
          return {
            ...data, desc: '与pdf版本完全一致的可编辑word版本，不允许模板中的文字部分作为图片直接插入word中，企业自拟的附件除外。', accept: '.doc', FileList: data.res3 ? [{
              name: data.res3
            }] : []
          };
        } else {
          return {
            ...data, desc: '企业法人代表人签字盖章，pdf格式，其他格式不受理', accept: '.pdf', FileList: data.res3 ? [{
              name: data.res3
            }] : []
          };
        }
      });
    });
  }
  // 获取其他tab详情
  getOtherDetail(tab) {
    if (tab.name !== '自查报告') {
      this.Tab = tab;
      this.http.getEnterTabDetail(tab.val).subscribe((res: any) => {
        this.OtherTabDetailTable = res;
      });
    }
    // this.IsCheckSelf = tab.name === '自查报告';
  }
  // toggol 自查和其它状态
  ToggleStatus(tab) {
    console.log(tab);
    this.IsCheckSelf = tab.name === '自查报告';

  }

  // 上传文件
  upload = (item: UploadXHRArgs) => {
    // 构建一个 FormData 对象，用于存储文件或其他参数
    const formData = new FormData();
    formData.append('file', item.file as any);
    formData.append('fileId', '');
    formData.append('totleNum', '1');
    formData.append('filename', item.file.name);
    formData.append('block', '1');
    formData.append('blobname', '0');
    const req = new HttpRequest('POST', this.http.upload, formData, {
      reportProgress: true,
      withCredentials: false
    });
    return this.http.upLoadFile(req).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) {
          (event as any).percent = event.loaded / event.total * 100;
        }
        item.onProgress(event, item.file);
      } else if (event instanceof HttpResponse) {
        // 处理成功
        item.onSuccess(event.body, item.file, event);
        this.insetFile({ name: item.file.name, url: event.body['body'] });
      }
    }, (err) => {
      console.error(err);
    });
  }

  // 选择当前字段
  selectCurent(cur) {
    this.CurrentUpload = cur;
  }
  // 插入到当前字段
  insetFile(file) {
    const params = {
      'res0': this.CurrentUpload.dictId,
      ...file
    };
    this.http.insetFileToCurrent(params).subscribe(res => {
      this.getCheckSelf();
    });
  }
  // 删除文件
  delFile = (item, id) => {
    const fileId = item ? item.accessoryId : id.id;
    this.http.delInsetFile(fileId).subscribe(res => {
      if (item) {
        this.getCheckSelf();
      } else {
        this.http.getUploadLists(this.CurrentUpload.dictId).subscribe((ress: any) => this.FileList = ress);
      }
    });
  }

  upLoadFiles(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, cur): void {
    this.selectCurent(cur);
    this.http.getUploadLists(this.CurrentUpload.dictId).subscribe((res: any) => {
      this.FileList = res.map(item => {
        let url = '';
        if (/pdf/.test(item.name)) {
          url = '/upload-file/officePreviewPdf?fileId=' + item.url;
        } else if (/png|jpg/.test(item.name)) {
          url = '/upload-file/downloadPreview/' + item.url;
        } else {
          url = '/upload-file/download/' + item.url;
        }
        return {
          ...item,
          url: url
        };
      });
      console.log(res);
    });
    this.tplModal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: true
    });
  }
  destroyTplModal(): void {
    this.tplModal.destroy();
    this.getOtherDetail(this.Tab);
    this.getFormTab();
  }
  closeTplModal() {
    this.tplModal.destroy();
  }
  insertRemark() {
    this.http.insertRemark(this.CurrentUpload).subscribe(res => {
      this.closeTplModal();
      this.getFormTab();
    });
  }
  comment(tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, cur) {
    this.selectCurent(cur);
    this.tplModal = this.modalService.create({
      nzTitle: '备注内容',
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: true,
      nzClosable: true
    });
  }

  commitReport(tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>) {
    this.tplModal = this.modalService.create({
      nzTitle: '提示语',
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: true,
      nzClosable: true
    });
  }

  commit() {
    this.http.submitForm().subscribe((res: any) => {
      this.closeTplModal();
      if (res.length > 0) {
        // this.Tabs.forEach(item => {
        //   item.alert = res.join(',').indexOf(item.name) >= 0;
        // });
        res.forEach(element => {
          this.msg.error(`请核对一下必填信息：${element}`);
        });
        console.log(this.Tabs);
        this.getFormTab();
        this.showBadge = true;
      } else {
        this.route.navigate(['/app/complian/progress']);
      }
    });
  }
}
