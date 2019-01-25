import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DictService } from 'src/app/core/dict/dict.service';
import { GuestRegistrationService } from '../guest-registration.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { WorkspaceService } from '../../workspace/workspace.service';
import { format } from 'date-fns';
import { NzMessageService, NzModalService, NzIconService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less']
})
export class RegistrationComponent implements OnInit {
  postForm: FormGroup;
  serialNumber = '20180103001';
  inputValue: string;
  pageNum = 1;
  pageSize = 10;
  total: any;
  options = [];
  formLabel: any;
  formExample = {
    sysCode: [''], // 所属系统
    roadId: [''],
    cityId: [''],
    provinceId: [''],
    districtId: [''],
    serialNumber: [''],
    enterId: [''],
    enterName: [''],
    complainList: this.fb.array([]) // 投诉人
  };
  cutNum = 5;
  cutFlag = true;
  isSpinning: boolean;
  url = environment.SERVER_URL;
  constructor(private fb: FormBuilder,
    private cache: CacheService,
    public router: Router,
    private http: WorkspaceService,
    private http2: GuestRegistrationService,
    private dict: DictService,
    private modalService: NzModalService,
    private msg: NzMessageService,
    private iconserve: NzIconService) { }

  // 投诉人
  complaList: FormGroup;

  // 获取投诉人表单组
  get workRecord() {
    return this.postForm.get('complainList') as FormArray;
  }
  // 创建投诉人
  createComplaForm() {
    let form;
    form = {
      idNum: [''],
      address: [''],
      name: [''],
      birthplace: [''],
      phone: [''],
      isRepresentative: [''], // 是否代表人
      idPhoto: [''],
      cameraPhoto: ['']
    };
    return this.fb.group(form);
  }
  // 新增投诉人
  addWorkRecord() {
    this.workRecord.push(this.createComplaForm());
  }
  // 删除投诉人
  removeItem(i) {
    this.workRecord.removeAt(i);
  }

  ngOnInit() {
    // 初始化表单
    console.log(this.cache.get('systemconfig'));
    if (this.cache.get('systemconfig')) {
      this.formExample.sysCode = this.cache.get('systemconfig').id;
    }
    if (this.cache.get('userData')) {
      this.formExample.roadId = this.cache.get('userData').roadId ? this.cache.get('userData').roadId : '';
      this.formExample.cityId = this.cache.get('userData').cityId ? this.cache.get('userData').cityId : '';
      this.formExample.provinceId = this.cache.get('userData').provinceId ? this.cache.get('userData').provinceId : '';
      this.formExample.districtId = this.cache.get('userData').districtId ? this.cache.get('userData').districtId : '';
    }
    console.log(this.cache.get('userData'));
    this.postForm = this.fb.group(this.formExample);
    // 添加默认投诉人
    this.addWorkRecord();
    // 查询字典
    this.iconserve.fetchFromIconfont({
      scriptUrl: '//at.alicdn.com/t/font_971791_52zfhvisd8p.js'
    });
  }
  // 调用读卡器
  getReadCard(i) {
    this.http.readCrad().then(res => res.json()).then(res => {
      this.http.reformUpload(this.http.getFileByBase64('data:image/jpeg;base64,' +
        res.data.photo, res.data.id_card_no + '.jpg')).subscribe((data: any) => {
          console.log(data);
          if (data.head.rspCode === '200') {
            this.workRecord.at(i).patchValue({
              idPhoto: '/upload-file/download/' + data.body
            });
          }
        });
      let time = res.data.period_of_validity;
      time = time.substring(time.length - 8);
      const time2 = format(new Date(), 'YYYYMMDD');
      // tslint:disable-next-line:radix
      if (parseInt(time) < parseInt(time2)) {
        this.msg.warning('身份证已过期');
      }
      this.workRecord.at(i).patchValue({
        idNum: res.data.id_card_no,
        name: res.data.name,
        birthplace: res.data.address,
      });
    }).catch(err => {
      this.msg.warning('请重新放置身份证!');
    });
  }
  // 企业搜索建议
  onInput(value: string): void {
    this.http.getEntSuggest(value).subscribe((res: any) => {
      this.options = res;
    });
  }
  // 选择企业
  selectEnt(item) {
    this.postForm.patchValue({
      enterName: item.name,
      enterId: item.id,
    });
  }
  // 点击拍照
  takePhoto(i) {
    if (this.workRecord.at(i).value.cameraPhoto || this.workRecord.at(i).value.cameraPhoto.length > 0) {
      this.modalService.confirm({
        nzTitle: '确定要重新拍照吗？',
        nzContent: '',
        nzOnOk: () => this.getPhoto(i),
        nzOnCancel: () => {
          return;
        }
      });
    } else {
      this.getPhoto(i);
    }

  }
  getPhoto(i) {
    if (!this.cutFlag) {
      return this.msg.error('请等' + this.cutNum + 's后再次拍照');
    }
    this.isSpinning = true;
    this.http.takePhoto(this.cache.get('userId')).subscribe((res: any) => {
      console.log(res);
      if (!res.code) {
        this.workRecord.at(i).patchValue({
          cameraPhoto: res
        });
      }
      this.isSpinning = false;
    });
    this.cutNum = 5;
    const timer = setInterval(() => {
      this.cutNum -= 1;
      this.cutFlag = false;
      if (this.cutNum < 0) {
        this.cutFlag = true;
        this.cutNum = 0;
        clearInterval(timer);
      }
    }, 1000);
  }
  // 切换到居住地
  equalAddr(i) {
    const val = this.workRecord.at(i).value.birthplace || this.workRecord.at(i).value.address;
    this.workRecord.at(i).patchValue({
      address: val,
      birthplace: val
    });
  }
  // 提交
  submit() {
    if (this.postForm.value.complainList) {
      const list = this.postForm.value.complainList;
      for (let i = 0; i < list.length; i++) {
        if (!list[i].name || !list[i].idNum || !list[i].birthplace) {
          return this.msg.error('请填写必填项');
        }
      }
    }
    this.http2.submitPetition(this.postForm.value).subscribe((res: any) => {
      if (!res.code) {
        this.modalService.success({
          nzMask: false,
          nzTitle: '提交成功',
          nzContent: '流水号:' + res.serialNumber,
        });
        this.postForm.reset();
        this.workRecord.controls = this.workRecord.controls.slice(0, 1);
      }
    });
  }
  // 转化时间戳
  parserDate(date) {
    const t = Date.parse(date);
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, '/'))).getTime();
    } else {
      return new Date().getTime();
    }
  }
}
