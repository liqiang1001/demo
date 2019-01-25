import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CacheService } from 'src/app/core/cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class AppdashboardService {

  constructor(private http: HttpClient, private cache: CacheService) { }

  getEntInfo() {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/findUser`, { id: this.cache.get('userId') });
  }

  getEnterInfo(entId, userId) {
    return this.http.get(environment.SERVER_URL + `/reform-service/reListAccessory/findEnterprise?enterpriseId=${entId}&userId=${userId}`);
  }

  getProgressConfig() {
    const id = this.cache.get('userId');
    return this.http.get(environment.SERVER_URL + `/reform-service/reListAccessory/findApprovalStatus?enterpriseId=${id}`);
  }

  getTeskList(id, userId) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/enterpriseTaskManager/queryEnterpriseTaskList`, {
      id: id,
      userId: userId
    });
  }

  // 查询历史列表
  getHistoryList(params) {
    return this.http.post(environment.SERVER_URL + 'off-site-inspect-service/hisroyFromManager/queryFromHistoryList', params);
  }
}
