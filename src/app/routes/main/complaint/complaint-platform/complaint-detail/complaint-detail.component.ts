import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DictService } from 'src/app/core/dict/dict.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { ComplaintService } from '../../complaint.service';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-complaint-detail',
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.less']
})
export class ComplaintDetailComponent implements OnInit {
  searchForm: FormGroup;
  searchParams = [];
  isDetail: boolean;
  inputValue: any;
  statusList: any;
  status: any;
  txList: any;
  isImage: boolean;
  files: any;
  contectFiles: any;
  imgurl: any;
  array: any;
  effect = 'scrollx';
  index = 0;
  constructor(private activeRoute: ActivatedRoute, public router: Router,
    private fb: FormBuilder,
    private cache: CacheService,
    private dict: DictService,
    private http: ComplaintService,
    private message: NzMessageService,

  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      if (params.id === '1') {
        this.isDetail = true;
      }
    });
    this.txList = this.cache.get('txList');
    if (this.txList.status === '未处理') {
      this.status = '1';
    } else {
      this.status = '0';
    }
    this.files = this.txList.files;
    this.contectFiles = this.txList.contectFiles;

    this.txList.createDate = this.http.changeTime(this.txList.createDate);
    this.statusList = this.dict._get('feedback_demo');
    let provinceId;
    if (this.txList.provinceId) {
      provinceId = this.txList.provinceId;
      if (this.txList.cityId) {
        provinceId = this.txList.provinceId + ',' + this.txList.cityId;
      } if (this.txList.countyId) {
        provinceId = this.txList.provinceId + ',' + this.txList.cityId + ',' + this.txList.countyId;
      }
    }
    let userProvinceId;
    if (this.txList.userProvinceId) {
      userProvinceId = this.txList.userProvinceId;
      if (this.txList.userCityId) {
        userProvinceId = this.txList.userProvinceId + ',' + this.txList.userCityId;
      } if (this.txList.userCountyid) {
        userProvinceId = this.txList.userProvinceId + ',' + this.txList.userCityId + ',' + this.txList.userCountyid;
      }
    }
    this.searchForm = this.fb.group({
      companyName: this.txList.companyName,
      platformName: this.txList.platformName,
      origin: this.txList.origin,
      website: this.txList.website,
      provinceId: provinceId,
      createDate: this.txList.createDate,
      status: this.txList.status,
      userName: this.txList.userName,
      userIdNum: this.txList.userIdNum,
      userPhone: this.txList.userPhone,
      reportRole: this.txList.reportRole,
      userProvinceId: userProvinceId,
      description: this.txList.description,
      amount: this.txList.amount,
      inputValue: [''],
      feedBack: this.txList.feedBack,
      inputValue2: [''],
    });
  }
  // 返回
  goBack() {
    history.go(-1);
  }

  handleOk() {
    this.isDetail = false;
    // const list = {
    //   feedback: this.searchForm.value.inputValue,
    //   id: this.txList.id
    // };
    const list = 'feedback=' + this.searchForm.value.inputValue + '&id=' + this.txList.id;
    this.http.update(list).subscribe((res: any) => {
      this.message.success('答复成功');
      history.go(-1);
    });
  }
  handleCancel() {
    this.isDetail = false;
  }

  handleCancel2() {
    this.isImage = false;
  }
  seeImg(e, index) {
    this.array = e;
    this.index = index;
    this.isImage = true;
    this.imgurl = e[index];
  }
  next() {
    if (this.index < this.array.length - 1) {
      ++this.index;
      this.imgurl = this.array[this.index];
    } else {
      this.imgurl = this.array[this.array.length - 1];
      this.message.error('这是最后一张');
    }
  }
  pre() {
    if (this.index > 0) {
      --this.index;
      this.imgurl = this.array[this.index];
    } else {
      this.imgurl = this.array[0];
      this.message.error('这是第一张');
    }
  }
  reply() {
    this.isDetail = true;
  }
  ngModelChanges(e) {
    this.searchForm.patchValue({
      inputValue: e.val
    });
  }

}
