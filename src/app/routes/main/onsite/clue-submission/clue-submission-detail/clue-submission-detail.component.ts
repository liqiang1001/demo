import { Component, OnInit } from '@angular/core';
import { OnsiteService } from '../../onsite.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-clue-submission-detail',
  templateUrl: './clue-submission-detail.component.html',
  styleUrls: ['./clue-submission-detail.component.less']
})
export class ClueSubmissionDetailComponent implements OnInit {
  // 获取当先线索id
  id;
  clueInfo: any;
  // 文件上传模态
  upfiles;
  isVisible = false;
  progress = 0;
  isImage: boolean;
  demoFiles1 = [
    // { id: 0, url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2168427908,4072089613&fm=200&gp=0.jpg' },
    // { id: 1, url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1309206248,989369195&fm=26&gp=0.jpg' },
    // { id: 2, url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2928813841,3058181575&fm=26&gp=0.jpg' },
    // { id: 3, url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2168427908,4072089613&fm=200&gp=0.jpg' },
  ];
  constructor(private http: OnsiteService, private acitveRoute: ActivatedRoute, private route: Router, private msg: NzMessageService) { }

  ngOnInit() {
    this.acitveRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.getClueDetail();
  }
  // 获取线索详情
  getClueDetail() {
    this.http.getClueDetail(this.id).subscribe(res => {
      this.clueInfo = { ...res };
    });
  }
  // 文件上传
  upload() {
    this.isVisible = true;
    this.findUploaded();
  }

  findUploaded() {
    this.http.getClueDetailFilesList(this.id).subscribe((res: any) => {
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
    this.http.reformFileUpload(item, that.id, this.getprogress);
  }

  delFile = (item) => {
    this.http.delUploadedFile(this.id, item).subscribe(() => {
      this.findUploaded();
    });
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  // 提交数据
  postData() {
    this.http.postClueData({
      'result': this.clueInfo.result,
      'threadLevel': this.clueInfo.threadLevel,
      'treatStatue': this.clueInfo.treatStatue,
      'id': this.id
    }).subscribe(res => {
      this.msg.success('提交成功');
      this.route.navigate(['main/onsite/clueSubmission']);
    });
  }
  fileOpen() {
    this.isImage = true;
    this.demoFiles1 = this.clueInfo.images;
  }

  handleCancel2() {
    this.isImage = false;
  }


}
