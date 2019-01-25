import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PassportService } from '../passport.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from '../../../core/cache/cache.service';




@Component({
  selector: 'app-forgot-passward',
  templateUrl: './forgot-passward.component.html',
  styleUrls: ['./forgot-passward.component.less']
})
export class ForgotPasswardComponent implements OnInit {
  public captchaImg;
  public verifyCodeKey;
  public loginName: string;
  public registerNum: string;

  logininfo = {
    'loginName': '',
    'validateCode': '',
    'validateCodeKey': '',
  };
  constructor(public router: Router, private login_http: PassportService, private message: NzMessageService ,
     private _CacheService: CacheService ) { }

  ngOnInit() {
    this._updateCapthaImg();
  }
  // 验证码
  _updateCapthaImg() {
    this.login_http.updateCapthaImg().subscribe(res => {
      this.captchaImg = 'data:image/jpeg;base64,' + res.validateCode;
      this.verifyCodeKey = res.validateCodeKey;
    });
  }
  // 下一页
  authenTication() {
    const that = this;
    if ( this.loginName && this.registerNum) {
      that.logininfo.loginName = that.loginName;
      that.logininfo.validateCode = that.registerNum;
      that.logininfo.validateCodeKey = that.verifyCodeKey;
      that.login_http.verifyUser(that.logininfo).subscribe(res => {
        const info = {
          loginName: res.loginName,
          mobile: res.mobile,
          // mobile: 18404983663,
          id: res.id,
        };
        that._CacheService.set('loginInfo', info );
        that.router.navigate(['register-result']);
      });
    } else {
      if ( !this.loginName) {
        that.message.error('请输入用户名');
        return;
      } else {
        that.message.error('请输入验证码');
        return;
      }
    }
  }
  // 返回
  goBack() {
    history.go(-1);
  }


}
