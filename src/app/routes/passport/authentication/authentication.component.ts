import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PassportService } from '../passport.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from '../../../core/cache/cache.service';




@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.less']
})
export class AuthenticationComponent implements OnInit {
  public passWord = '';
  public passWord2 = '';
  public registerNum;
  public mobile;
  public loginName: string;
  public cutNum: number;
  public cutFlag: boolean;
  info = {
    id: '',
    mobile: null,
    pwd: '',
    verificationCode: '',
  };
  constructor(
    private activatedRoute: ActivatedRoute, private login_http: PassportService,
    private message: NzMessageService, private router: Router, private _CacheService: CacheService) {
    //   activatedRoute.queryParams.subscribe(queryParams => {

    //   this.loginName = queryParams.loginName;
    //   this.mobile = queryParams.mobile;
    //   this.info.id = queryParams.id;
    // });
  }


  ngOnInit() {
    // console.log(this._CacheService.get('loginInfo'));
    this.loginName = this._CacheService.get('loginInfo').loginName;
    this.mobile = this._CacheService.get('loginInfo').mobile;
    this.info.id = this._CacheService.get('loginInfo').id;
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  // 修改密码按钮
  _editPersonPWD() {
    const that = this;
    if (this.passWord === '') {
      that.message.error('密码不能为空');
      return;
    }
    console.log(false);
    // this.login_http.regexPassword(this.passWord);
    if (that.login_http.regexPassword(that.passWord)) {
      if (this.passWord2 === '') {
        this.message.error('再次输入密码不能为空');
        return;
      } else {
        if (this.passWord2 !== this.passWord) {
          this.message.error('两次输入密码不匹配');
          return;
        }
        if (this.registerNum === '') {
          this.message.error('验证码不能为空');
          return;
        }
      }

    }
    // this.login_http.regexPassword(this.passWord);
    this.info.pwd = this.passWord;
    this.info.mobile = this.mobile;
    this.info.verificationCode = this.registerNum;
    this.login_http.editPersonPWD(that.info).subscribe(res => {
      // that.router.navigate(['register']);
    });

  }
  // 获取手机验证码
  _sendMsg() {
    const that = this;
    that.cutNum = 60;
    const timer = setInterval(() => {
      that.cutNum -= 1;
      if (that.cutNum < 0) {
        that.cutNum = 0;
        that.cutFlag = false;
        clearInterval(timer);
      }
    }, 1000);

    this.login_http.sendMsg(that.mobile).subscribe(res => {
      that.cutNum = 60;
      that.cutFlag = true;
      that.info.verificationCode = res.data;
    });
  }
}


