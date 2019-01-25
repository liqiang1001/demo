import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from '../../../../core/cache/cache.service';
import { UserService } from '../user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { PassportService } from 'src/app/routes/passport/passport.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('PassInput') PassInput;
  changePassword: FormGroup;
  canGet = true;
  cutdown = 60;
  constructor(private fb: FormBuilder,
    private _CacheService: CacheService,
    private userService: UserService,
    private passportHttp: PassportService,
    private msg: NzMessageService) { }

  ngOnInit() {
    this.changePassword = this.fb.group({
      id: this._CacheService.get('userData').id,
      pwd: null,
      cppwd: null,
      oldPwd: null,
      mobile: { value: this._CacheService.get('userData').mobile, disabled: true },
      verificationCode: null
    });
    setTimeout(() => {
      this.PassInput.nativeElement.focus();
    }, 100);
  }

  _submitForm(event, value) {
    if (!value.oldPwd) {
      return this.msg.error('请输入登录密码');
    }
    if (this.passportHttp.regexPassword(value.pwd)) {
      if (value.pwd !== value.cppwd) {
        this.msg.error('确认密码错误！');
        return;
      }
      if (!value.verificationCode) {
        this.msg.error('请输入验证码');
        return;
      }
      this.userService.submitPwd(value).subscribe((res: any) => {
        this.msg.success('密码修改成功');
        //   // console.log(res);
      });
    }
  }

  getVerification() {
    const that = this;
    let timer;
    if (this.canGet) {
      this.canGet = false;
      this.userService.getVerifyCode(this._CacheService.get('userData').mobile).subscribe((res: any) => {
        // console.log(res);
        if (!res.code) {
          timer = window.setInterval(() => {
            if (that.cutdown > 0) {
              that.cutdown -= 1;
            } else {
              window.clearInterval(timer);
              that.cutdown = 60;
              that.canGet = true;
            }
          }, 1000);
        } else {
          this.canGet = true;
        }
      });
    }
  }

}
