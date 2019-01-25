import { Component, OnInit } from '@angular/core';
import { DictService } from '../../../../../core/dict/dict.service';
import { CacheService } from '../../../../../core/cache/cache.service';
import { OnsiteService } from '../../onsite.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-check-redult-detail',
  templateUrl: './check-redult-detail.component.html',
  styleUrls: ['./check-redult-detail.component.less']
})
export class CheckRedultDetailComponent implements OnInit {
  productId: '';
  userDetail = {
    companyName: '',
    checkPerson: '',
    checkTime: '',
  };
  isloading: boolean;
  list: any;
  isImage: boolean;
  demoFiles1 = [
    // { id: 0, url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2168427908,4072089613&fm=200&gp=0.jpg' },
    // { id: 1, url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1309206248,989369195&fm=26&gp=0.jpg' },
    // { id: 2, url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2928813841,3058181575&fm=26&gp=0.jpg' },
    // { id: 3, url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2168427908,4072089613&fm=200&gp=0.jpg' },
  ];
  constructor(private cache: CacheService, private http: OnsiteService, private dict: DictService, private routerIonfo: ActivatedRoute) { }

  ngOnInit() {
    this.productId = this.routerIonfo.snapshot.queryParams['id'];
    this.getdetail(this.productId);
    this.getCompanyMsg(this.productId);

  }
  // 获取企业核查信息
  getdetail(taskGroupId) {
    this.isloading = true;
    this.http.CheckResultDetail(this.cache.get('userId'), taskGroupId).subscribe(res => {
      this.isloading = false;
      console.log(res);
      this.list = res;
    });
  }
  // 获取企业组核查信息
  getCompanyMsg(taskGroupId) {
    this.isloading = true;
    this.http.checkresultCompanyMsg(this.cache.get('userId'), taskGroupId).subscribe((res: any) => {
      this.isloading = false;
      this.userDetail = res;
    });
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  fileOpen(id) {
    console.log(id);
    this.isImage = true;
    this.http.getClueDetailFiles(id).subscribe((res: any) => {
      this.fileType(res);
    });
    // this.demoFiles1 = this.clueInfo.images;
  }

  handleCancel2() {
    this.isImage = false;
    this.demoFiles1 = [];
  }
  fileType(data) {
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].type === 'image') {
        this.demoFiles1.push(data[i]);
      }
    }
  }

}
