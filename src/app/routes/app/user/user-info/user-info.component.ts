import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { DictService } from 'src/app/core/dict/dict.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { AvatarCropperComponent } from '../avatar-cropper/avatar-cropper.component';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.less']
})
export class UserInfoComponent implements OnInit {
  searchForm: FormGroup;
  searchParams = [];
  userinfo: any;
  type = 'info';
  isPhone: boolean;
  loginPass = new FormControl('');
  newMobile = new FormControl('');
  yzm = new FormControl('');
  time: number;
  isDisable: boolean;
  seccessCode: boolean;
  tupian = 'assets/image/user-header.png';
  constructor(private http: UserService,
    private cache: CacheService,
    private fb: FormBuilder,
    private message: NzMessageService,
    public router: Router,
    private modalService: NzModalService,
    private dict: DictService) { }

  ngOnInit() {
    console.log(this.cache.get('EntInfo'));
    // EntInfo
    this.findUser();
    this.searchForm = this.fb.group({
      name: [''],
      phone: [''],
      job: [''],
      email: [''],
      enterpriseName: [''],
      typeNames: [''],
      registrationNumber: [''],
      registrationAddress: [''],
    });
  }

  findUser() {
    this.http.findUser(this.cache.get('userId')).subscribe((res: any) => {
      console.log(res);
      if (res.headPicture) {
        this.tupian = res.headPicture;
      }
      this.userinfo = res;
      this.searchForm.patchValue({
        name: this.userinfo ? this.userinfo.name : [''],
        phone: this.userinfo ? this.userinfo.mobile : [''],
        job: this.userinfo ? this.userinfo.job : [''],
        email: this.userinfo ? this.userinfo.email : [''],
        enterpriseName: this.userinfo ? this.userinfo.enterpriseName : [''],
        typeNames: this.userinfo ? this.userinfo.typeNames : [''],
        registrationNumber: this.userinfo ? this.userinfo.registrationNumber : [''],
        registrationAddress: this.userinfo ? this.userinfo.registrationAddress : [''],
      });
    });
  }

  upImage() {
    this.cache.set('tupian', this.tupian);
    const modal = this.modalService.create({
      nzWidth: 810,
      nzTitle: '头像更换',
      nzContent: AvatarCropperComponent,
      nzFooter: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        console.log(result);
        this.tupian = result;
      }
    });
  }
  changePhone() {
    this.isPhone = true;
  }
  // 获取验证码
  getCode() {
    const regphone = /^1[34578]\d{9}$/;
    if (this.loginPass.value) { // 登录密码验证
      if (regphone.test(this.newMobile.value)) {  // 电话号码
        this.checkTelSecond(this.newMobile.value);
      } else {
        if (!this.newMobile.value) {
          this.message.error('手机号不能为空！');
        } else {
          this.message.error('手机号错误，请重新输入！');
        }
      }
    } else {
      this.message.error('请输入登录密码!');
    }
  }
  checkTelSecond(phone) {  // 手机号是否已注册验证
    const that = this;
    this.http.verifyMobile(phone).subscribe((res: any) => {
      console.log(res);
      if (res.isExist === '0') {
        this.http.getVerifyCode(phone).subscribe((ress: any) => {
          console.log(ress);
          if (ress) {
            this.message.success('发送成功!');
            this.isDisable = true;
            this.time = 60;
            const timet = setInterval(function () {
              that.time--;
              if (that.time <= -1) {
                clearInterval(timet);
                that.isDisable = false;
              }
            }, 1000);
          }
        });
      } else {
        this.message.error('该手机号已注册！');
      }
    });
  }
  handleMobile() {
    this.isPhone = false;
  }
  verifyMobile() {
    const that = this;
    if (this.loginPass.value) {
      if (this.newMobile.value) {
        if (this.yzm.value) {
          const body = {
            id: this.cache.get('userId'),
            pwd: this.loginPass.value,
            mobile: this.newMobile.value,
            verificationCode: this.yzm.value
          };
          this.http.restMobile(body).subscribe((res: any) => {
            console.log(res);
            if (res === 'success') {
              that.seccessCode = true;
              that.message.success('手机号修改成功!');
              this.findUser();
              that.time = -1;
              that.isDisable = false;
              that.isPhone = false;
            }
          });
        } else {
          this.message.error('验证码为空，请输入验证码!');
        }
      } else {
        this.message.error('手机号为空，请输入手机号!');
      }
    } else {
      this.message.error('登陆密码为空，请输入手机号!');
    }
  }
  tosubmit(params) {
    const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!params.name) {
      this.message.error('展示名不能为空！');
      return;
    }
    if (!params.job) {
      this.message.error('职位不能为空！');
      return;
    } else if (params.job.length > 20) {
      this.message.error('职位输入过长，请重新输入！');
      return;
    }
    if (!params.email) {
      this.message.error('请输入邮箱！');
      return;
    } else if (params.email) {
      if (email.test(params.email)) {
        this.verifyReEmail(params.email);
      } else {
        this.message.error('邮箱输入错误，请重新输入！');
      }
    }
    if (!params.phone) {
      this.message.error('请输入手机号！');
      return;
    }
    const body = {
      id: this.cache.get('userId'),
      job: params.job,
      email: params.email,
      name: params.name,
      headPicture: this.tupian
    };
    this.http.submitInfo(body).subscribe((res: any) => {
      console.log(res);
      if (res === 'success') {
        this.message.success('信息修改成功！');
        this.router.navigate(['app']);
      }
    });
  }
  changePageContent(info) {
    this.router.navigate([`app/user/${info}`]);
  }
  verifyReEmail(values) {   // 是否邮箱重复验证
    const body = { id: this.cache.get('userId'), email: values };
    this.http.verifyReEmail(body).subscribe((res: any) => {
      if (res.isExist === '0') {
        return true;
      } else {
        this.message.error('该邮箱已经注册过!');
        return false;
      }
    });
  }

}
