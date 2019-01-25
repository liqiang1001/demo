import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Options } from 'selenium-webdriver/opera';
import { NzMessageService } from 'ng-zorro-antd';
@Injectable({
  providedIn: 'root'
})
export class PassportService {
  constructor(private http: HttpClient, private message: NzMessageService) { }
  // 获取验证码
  updateCapthaImg(): Observable<any> {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/noAuth/validateCode/createValidateCode`);
  }
  // 登陆 验证token
  login(info): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/oauth-server/uaa/login/token`, { ...info });
  }
  // 登陆 验证 Authorization
  login2(info, one): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/oauth-server/uaa/oauth/token?refresh_token=${one}&grant_type=refresh_token`,
      { ...info },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json;  text/plain; charset=UTF-8;multipart/form-data;',
          'Authorization': 'Basic Y2xpZW50OnNlY3JldA=='
        }),
      });
  }
  // 密码找回
  verifyUser(options): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/noAuth/validateCode/verifyUser`, { ...options });
  }
  // 获取验证码
  sendMsg(mobile = null): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/personalCenter/sendMsg`, { mobile: mobile });
  }
  // 提交密码修改
  editPersonPWD(options): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/noAuth/validateCode/editPersonPWD`, { ...options });
  }
  // 密码验证
  regexPassword(str) {
    const reg1 = /[!@#$%^&*().,;~_?<>{}]{1}/;
    const reg2 = /([a-zA-Z0-9!@#$%^&*().,;~_?<>{}]){8,25}/;
    const reg3 = /[a-zA-Z]+/;
    const reg4 = /[0-9]+/;
    if (reg1.test(str) && reg2.test(str) && reg3.test(str) && reg4.test(str)) {
      return true;
    } else if (!reg2.test(str)) {
      this.message.error('密码长度在8-25位');
      return false;
    } else if (!reg3.test(str)) {
      this.message.error('需含有字母');
      return false;
    } else if (!reg4.test(str)) {
      this.message.error('需含有数字');
      return false;
    } else if (!reg1.test(str)) {
      this.message.error('需含有特殊字符');
      return false;
    }
  }
   // 验证表单是否为空
   onValueChanged(data?: any, resetForm?: any, formErrors?: any, validationMessages?: any) {
    if (!resetForm) { return; }
    const form = resetForm;
    // tslint:disable-next-line:forin
    for (const field in formErrors) {
      formErrors[field] = '';
      const control = form.get(field);
      if (control && control.errors) {
        if (!control.value) {
          const msg = validationMessages[field]['required'];
          this.message.error(msg);
          return '1';
        }
      }
      if (control && control.dirty && !control.valid) {
        const messages = validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.message.error(messages[key]);
          return '1';
        }
      }
    }
  }
}
