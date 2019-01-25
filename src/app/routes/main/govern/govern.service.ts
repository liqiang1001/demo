import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GovernService {

  constructor(private http: HttpClient) { }
  //  获取城市
  getCitys(options): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/areaManager/findByRankNumAndPrentId`, { ...options });
  }
  // 获取区
  getDistricts(options): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/areaManager/findByRankNumAndPrentId`, { ...options });
  }
  // 获取企业类型数据
  getRoleType(type): Observable<any> {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/dictManager/findUserTypeByUserId?userId=${type}`);
  }

  // 获取自定义列
  getDataList(options): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/enterpriseDocument/findEnterpriseList`, { ...options });
  }
  // 导出
  outFile(options): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/enterpriseDocument/export`,
      options, { responseType: 'arraybuffer' });
  }
  // 查询企业基本信息
  getMsg(id): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/enterpriseDocument/findEnterpriseInfo`, { id: id });
  }
  // 保存企业信息
  save(options): Observable<any> {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/enterpriseDocument/edit`, { ...options });
  }
  // 查询变更审批列表
  getChangeList(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/approvedManager/findApprovedList`, { ...params} );
  }
  // 变更审批
  auditChange(parmas) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/approvedManager/examineRequest`, parmas);
  }

}

