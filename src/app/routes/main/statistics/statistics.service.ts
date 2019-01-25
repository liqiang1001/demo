import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'src/app/core/cache/cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient, private cache: CacheService) { }

  // *******************经营信息开始*****************//
  // 日期列表查询
  getDateList() {
    return this.http.get(environment.SERVER_URL + `/off-site-inspect-service/statisticalQuery/operatingDateList`);
  }
  // 获取表格列表
  getCreditPlatform(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/statisticalQuery/findCreditPlatform`, params);
  }
  // 将时间转换为Date对象
  showtime(time, type = '0') {
    if (time) {
      let timeData = '';
      const month = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1);
      if (type === '1') {
        timeData = time.getFullYear() + '-' + month;
      } else {
        timeData = time.getFullYear() + '-' + month + '-' + time.getDate();
      }
      return timeData;
    } else {
      return '';
    }
  }
  // 导出文件

  exportFile(params, url, text, ) {
    this.http.post(environment.SERVER_URL + `/off-site-inspect-service/statisticalQuery/${url}`, params, {
      responseType: 'blob'
    }).subscribe((res: any) => {
      console.log(res);
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', text);
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
  // ********************整改明细开始*****************//
  // 获取企业类型数据
  getRoleType() {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/dictManager/findUserTypeByUserId?userId=`
      + this.cache.get('userId'));
  }
  // 获取表格数据
  getrectifyMonitor(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/statisticalQuery/rectifyMonitor`, params);
  }

  // 获取图表信息
  getMonitorDetails(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/statisticalQuery/rectifyMonitorDetails`, params);

  }
  // ********************流动缺口开始*****************//
  // 获取表格数据
  getGap(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/statisticalQuery/findGap`, params);
  }
  // ********************日常信息开始*****************//
  getEveryDayMsg(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/statisticalQuery/findEveryDayMsg`, params);
  }

}
