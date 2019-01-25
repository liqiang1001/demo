import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // /usermanagementservice/user/
  findUser(id) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/findUser`, { id: id });
  }
  // 验证手机号是否已注册
  verifyMobile(mobile) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/verifyReMobile`,
      { mobile: mobile });
  }
  // 修改手机号
  restMobile(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/personalCenter/editPersonMobile`, params
    );
  }
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
  // 验证邮箱是否已注册
  verifyReEmail(params) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/user/verifyReEmail', params);
  }
  // 提交修改信息
  submitInfo(params) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/personalCenter/editPerson', params);
  }
}
