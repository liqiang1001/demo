import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'src/app/core/cache/cache.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  uploadUrl = environment.SERVER_URL + '/upload-file/upload';
  constructor(private http: HttpClient, private cache: CacheService, private router: Router) { }

  getTaskMenu(param) {
    const params = {
      batchId: param.batchId,
      enterId: this.cache.get('userId'),
      id: param.id
    };
    return this.http.post(environment.SERVER_URL + '/off-site-inspect-service/enterpriseTaskManager/queryTaskMenu', params);
  }

  getForm(param) {
    const params = {
      ...param,
      userId: this.cache.get('userId'),
      enterId: this.cache.get('userId'),
    };
    return this.http.post(environment.SERVER_URL + '/off-site-inspect-service/enterpriseTaskManager/queryForm', params);
  }

  fillForm(param) {
    const params = {
      ...param,
      enterId: this.cache.get('userId'),
      batchBeginDate: this.cache.get('formInfo').beginDate,
      batchEnterpriseId: this.cache.get('formInfo').batchEnterpriseId,
      batchId: this.cache.get('taskInfo').batchId,
      formId: this.cache.get('formInfo').formId,
      formType: this.cache.get('formInfo').formInfo.formType,
    };
    // console.log(params);
    return this.http.post(environment.SERVER_URL + '/off-site-inspect-service/enterpriseTaskManager/fillForm', params);

  }

  // 变更表单
  changeForm(param) {
    const params = { userId: this.cache.get('userId'), ...param};
    return this.http.post(environment.SERVER_URL + '/off-site-inspect-service/hisroyFromManager/applyUpdate', params);

  }

  // 删除多条记录中的一条
  delArrForm(params) {
    return this.http.post(environment.SERVER_URL + '/off-site-inspect-service/enterpriseTaskManager/delArrayFormDetail', params);
  }
}
