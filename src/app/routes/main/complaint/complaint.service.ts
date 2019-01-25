import { Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/cache/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd';

const BASE_URL = 'proxy';
const TYPE = '/wechatservice/noAuth';


@Injectable({
  providedIn: 'root'
})

export class ComplaintService {

  constructor(private http: HttpClient, private cache: CacheService,
    private message: NzMessageService
  ) { }
  getFormList(params) {
    return this.http.post(environment.SERVER_URL + '/wechatservice/complaintReport/findReportInfo', params);
  }
  // 导出
  save(params) {
    return this.http.get(environment.SERVER_URL + '/wechatservice/complaintReport/exportReportInfo?request='
      + JSON.stringify(params), { responseType: 'arraybuffer' });
  }

  update(params) {
    return this.http.post(environment.SERVER_URL + `/wechatservice/complaintReport/updateReportFeedBack?${params}`, params);
  }
  showtime(time) {
    if (time) {
      const month = time.getMonth() + 1;
      const timeData = time.getFullYear() + '-' + month + '-' + time.getDate();
      return timeData;
    } else {
      return '';
    }
  }
  // 将时间转换为Date对象
  changeTime(time) {
    const da = new Date(time);
    const year = da.getFullYear() + '-';
    const month = da.getMonth() + 1 + '-';
    const date = da.getDate();
    return [year, month, date].join('');
  }

}
