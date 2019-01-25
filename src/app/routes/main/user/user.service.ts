import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // user 获取验证码
  getVerifyCode(mobile) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/personalCenter/sendMsg', {
      mobile: mobile
    });
  }

  // user 提交修改密码
  submitPwd(params) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/personalCenter/editPersonPWD', params);
  }
}
