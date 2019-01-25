import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  enterpriseId: string; // 企业id
  userId; // 管理员id

  // 要上传的本地变量的数据
  rectificationStatus = ''; // 整改状态y
  iframeURL: SafeResourceUrl;
  constructor(
    private activatedRouter: ActivatedRoute,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe((params: Params) => {
      this.enterpriseId = params['companyId'];
      this.userId = params['userId'];
    });
    this.iframeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.BI_IP + '/bi?name=entinfo.frm&sign='
      + sessionStorage.getItem('token') + '&enterpriseId=' + this.enterpriseId);
  }

}
