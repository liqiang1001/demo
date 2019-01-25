import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../../core/cache/cache.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DefaultService {

  constructor(private http: HttpClient, private cache: CacheService) { }

  getMeun(): Observable<any> {
    const that = this;
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/menuManager/findMenuByUser', {
      'userId': that.cache.get('userId'),
      'systemCode': 'offSiteCode'
    });
  }
  getArea(): Observable<any> {
    const that = this;
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/enterpriseUser/findEnterpriseUser',
      { id: that.cache.get('userInfo').id });
  }
  dealMeun(Menu) {
    const AuthMenu = [];
    function dealDate(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].childMenus && arr[i].childMenus.length > 0) {
          dealDate(arr[i].childMenus);
        } else {
          AuthMenu.push({
            name: arr[i].name,
            url: '/main' + arr[i].url
          });
        }
      }
    }
    dealDate(Menu);
    this.cache.set('AuthMenu', AuthMenu);
  }
  // 获取按钮权限
  getMenuAccess(sysMenuId) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/menuManager/findMenuButtonByUser`, {
      'userId': this.cache.get('userId'),
      'sysMenuId': sysMenuId
    });
  }
}
