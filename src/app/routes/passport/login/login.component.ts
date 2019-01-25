import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PassportService } from '../passport.service';
import { CacheService } from '../../../core/cache/cache.service';
import { DefaultService } from 'src/app/layout/default/default.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})

export class LoginComponent implements OnInit {
  @ViewChild('PassInput') PassInput;
  public captchaImg;
  public verifyCodeKey;
  public userName: string;
  public passWord: string;
  public registerNum;
  public checked: any;
  users = {
    'userName': '',
    'pwd': '',
    'verifyCodeKey': '',
    'verifyCode': '',
    'grant_type': 'password',
    'configId': null
  };
  logins = {
    'refresh_token': '',
    'grant_type': 'refresh_token',
  };
  constructor(
    public router: Router,
    private defServe: DefaultService,
    private login_http: PassportService,
    private _CacheService: CacheService,
    private msg: NzMessageService
  ) {


  }


  ngOnInit() {
    setTimeout(() => {
      this.PassInput.nativeElement.focus();
    }, 100);
    const that = this;
    this._updateCapthaImg();
    const username = localStorage.getItem('userName');
    const password = localStorage.getItem('passWord');
    const logChecked = localStorage.getItem('logChecked');
    if (username) {
      that.userName = username;
      that.passWord = password;
      that.checked = logChecked;
    }
    this._login();
  }
  _updateCapthaImg() {
    this.login_http.updateCapthaImg().subscribe(res => {
      this.captchaImg = 'data:image/jpeg;base64,' + res.validateCode;
      this.verifyCodeKey = res.validateCodeKey;
    });
  }

  _login() {
    const that = this;
    // 判断用户名 密码 验证码
    if (!this.userName || !this.passWord || !this.registerNum) {
      return;
    }
    this.users.userName = this.userName;
    this.users.pwd = this.passWord;
    this.users.verifyCode = this.registerNum;
    this.users.verifyCodeKey = this.verifyCodeKey;
    this.users.configId = this._CacheService.get('systemconfig') ? this._CacheService.get('systemconfig').id : null;
    this.login_http.login(that.users)
      .subscribe({
        next(res) {
          if (that.checked) {
            localStorage.setItem('userName', that.userName);
            localStorage.setItem('passWord', that.passWord);
            // console.log(that.checked);
            localStorage.setItem('logChecked', that.checked);
          } else {
            localStorage.setItem('userName', '');
            localStorage.setItem('passWord', '');
            localStorage.setItem('logChecked', 'false');
          }
          // console.log(res);
          if (res.code === 'E004' || res.code === 'E005' || res.code === 'E006') {
            that.registerNum = '';
            that._updateCapthaImg();
          }
          that._CacheService.set('userId', res.userInfo.id);
          that._CacheService.set('userInfo', res.userInfo);
          that.logins.refresh_token = res.token.refreshToken.value;
          that.login_http.login2(that.logins, res.token.refreshToken.value).subscribe({
            next(ress) {
              that._CacheService.set('token', ress.access_token);
              if (res.userInfo.userType === 1) {
                that.msg.error('企业登录请从首页选择区域==>[北京市-北京市-北京市]进入！');
                // that.router.navigate(['app']);
              } else {
                that.defServe.getMeun().subscribe(res3 => {
                  console.log(sessionStorage.getItem('74'), res3);
                  if (sessionStorage.getItem('74')) {
                    const item74 = res3.filter(item => item.name === '线上审批');
                    item74[0].name = '现场检查';
                    item74[0].childMenus = item74[0].childMenus.map(item => {
                      if (item.name === '合规检查审批') {
                        item.childMenus.map(i => {
                          i.name = i.name.slice(2);
                          return i;
                        });
                        item.name = '现场检查任务';
                      }
                      return item;
                    });
                    res3 = res3.map(item => {
                      if (item.name === '线上审批') {
                        return item74;
                      } else {
                        return item;
                      }
                    });
                  }

                  const MENU = [{ 'name': '首页', 'url': '/main/dashboard' }, ...res3.filter(item => item.name !== '个人中心')];
                  that._CacheService.set('MENU', MENU);
                  that._CacheService.set('MenuRes', res3);

                  that.router.navigate(['main']);

                  // that.defServe.dealMeun(res3);
                });
              }
            },
            error(err) {
            }
          }
          );
        },
        error(err) {
        }
      });
  }
  forgotPassWord() {
    const that = this;
    that.router.navigate(['register']);
  }
}



