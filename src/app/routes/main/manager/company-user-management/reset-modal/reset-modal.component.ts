import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { CacheService } from 'src/app/core/cache/cache.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import { PassportService } from 'src/app/routes/passport/passport.service';

@Component({
  selector: 'app-reset-modal',
  templateUrl: './reset-modal.component.html',
  styleUrls: ['./reset-modal.component.less']
})
export class ResetModalComponent implements OnInit {
  @ViewChild('PhoneInput') PhoneInput;
  @ViewChild('PassInput') PassInput;
  resetForm: FormGroup;
  searchParams = [];
  passInfo: any;
  flag: boolean;
  formErrors = {
    'newpass': '',
    'newpass2': '',
    'mobile': ''

  };
  validationMessages = {
    'newpass': {
      'required': '密码不能为空',
    },
    'newpass2': {
      'required': '确定密码不能为空',
    },
    'mobile': {
      'required': '手机号不能为空',
    }
  };
  constructor(private message: NzMessageService,
    private model: NzModalRef,
    private http: ManagerService,
    private reg: PassportService,
    private fb: FormBuilder, private cache: CacheService,
    private modalService: NzModalService, ) { }

  ngOnInit() {
    this.passInfo = this.model.getContentComponent().item;
    this.flag = this.model.getContentComponent().flag;
    this.buildForm(this.flag);
    // 自动聚焦
    setTimeout(() => {
      if (this.flag) {
        this.PassInput.nativeElement.focus();
      } else {
        this.PhoneInput.nativeElement.focus();
      }
    }, 100);
  }
  // 构建表单方法
  buildForm(flag): void {
    // 通过 formBuilder构建表单
    if (flag) {
      this.resetForm = this.fb.group({
        newpass: ['', Validators.required],
        newpass2: ['', Validators.required],
      });
    } else {
      this.resetForm = this.fb.group({
        mobile: ['', Validators.required],
      });
    }
  }
  // 关闭模态框
  handleCancel() {
    this.model.destroy();
  }
  modifyPriseUser(param) {
    console.log(this.passInfo);
    if (this.reg.onValueChanged(param, this.resetForm, this.formErrors, this.validationMessages) === '1') {
      return;
    }
    if (this.flag) {
      if (param.newpass !== param.newpass2) {
        this.message.error('两次密码输入不一致');
        this.resetForm.reset();
        return;
      } else {
        const params = {
          id: this.passInfo.id, // 不确定
          pwd: param.newpass2,
          mobile: this.passInfo.mobile
        };
        this.http.restPassWord(params).subscribe(res => {
          console.log(res);
          if (!res) {
            this.message.success('密码重置成功');
            this.resetForm.reset();
            this.model.destroy(true);
          }
        });
      }
    } else {
      if (/^1[345678]\d{9}$/.test(param.mobile)) {
        this.http.verifyMobile(param.mobile).subscribe((res: any) => {
          let params;
          if (this.model.getContentComponent().gov) {
            params = {
              mobile: param.mobile,
              id: this.passInfo.id,
              configId: this.passInfo.configId ? this.passInfo.configId : null
            };
          } else {
            params = {
              mobile: param.mobile,
              id: this.passInfo.id
            };
          }
          if (res.isExist === '0') {
            this.http.restMobile(params).subscribe(data => {
              if (!data) {
                this.message.success('重置手机号成功');
                this.resetForm.reset();
                this.model.destroy(true);
              }
            });
          } else {
            this.message.error('手机号已存在');
          }
        });
      } else {
        this.message.error('手机号格式不正确');
      }
    }
  }
}
