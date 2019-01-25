import { Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/cache/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RiskService {

  constructor(private http: HttpClient, private cache: CacheService) { }
  BI = environment.BI_IP;
  // 非法集资列表
  getIllegalList(params) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/illegalFundRaising/queryFormByPage', params);
  }

  // 风险预警列表
  getWarningList(params) {
    return this.http.post(environment.SERVER_URL + 'usermanagementservice/riskManager/queryRiskWarningData', params);
  }
}
