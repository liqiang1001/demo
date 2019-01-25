import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'src/app/core/cache/cache.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplianService {
  upload = environment.SERVER_URL + `/upload-file/uploadAppendAndConvert`;
  constructor(private http: HttpClient, private cache: CacheService) { }

  getProgressConfig() {
    const id = this.cache.get('userId');
    return this.http.get(environment.SERVER_URL + `/reform-service/reListAccessory/findApprovalStatus?enterpriseId=${id}`);
  }

  getEntMsgStatus() {
    const msgId = this.cache.get('entMsgInfo').id;
    return this.http.get(environment.SERVER_URL + `/reform-service/reListAccessory/enterpriseMsgStatus?enterpriseMsgId=${msgId}`);
  }

  getFourReList() {
    const params = {
      'enterpriseMsgId': this.cache.get('entMsgInfo').id,
      'status': '1',
      'userId': this.cache.get('userId')
    };
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/findFourReList`, params);
  }

  getEnterTab() {
    const msgId = this.cache.get('entMsgInfo').id;
    const typeIds = this.cache.get('EntInfo').typeIds;
    return this.http.get(environment.SERVER_URL + `/reform-service/dict/findEnterTab?enterpriseMsgId=${msgId}&typeIds=${typeIds}`);
  }

  getEnterTabDetail(tab) {
    const params = {
      'enterpriseMsgId': this.cache.get('entMsgInfo').id,
      'status': '1',
      'userId': this.cache.get('userId'),
      'res0': tab
    };
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/findReListList`, params);
  }

  // 查询对应上传列表
  getUploadLists(dictId) {
    const params = {
      dictId: dictId,
      enterpriseMsgId: this.cache.get('entMsgInfo').id,
      status: '1',
      userId:  this.cache.get('userId'),
    };
    return this.http.post(environment.SERVER_URL + '/reform-service/reListAccessory/findEveryReList', params);
  }
  // 上传文件
  upLoadFile(req) {
    return this.http.request(req);
  }
  // 上传成功后插入对应字段
  insetFileToCurrent(param) {
    const params = {
      ...param,
      'fileDepend': '',
      'fileSize': '',
      'fileType': '',
      'id': '',
      'enterpriseMsgId': this.cache.get('entMsgInfo').id,
      'status': '1',
      'userId': this.cache.get('userId'),
      createTime: new Date().toISOString()
    };
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/insertReListAccessory`, params);
  }
  // 删除对应文件
  delInsetFile(dictId) {
    const id = this.cache.get('userId');
    const msgId = this.cache.get('entMsgInfo').id;
    return this.http.get(environment.SERVER_URL + `/reform-service/reAccessory/deleteReAccessory?userId=${id}&id=${dictId}&enterpriseMsgId=
    ${msgId}`);
  }
  // 添加评论
  insertRemark(item) {
    const params = {
      dictId: item.dictId,
      enterpriseMsgId: this.cache.get('entMsgInfo').id,
      id: item.id,
      remark: item.remark,
      userId:  this.cache.get('userId'),
    };
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/insertListRemark`, params);
  }
  // 提交表单
  submitForm() {
    return this.http.get(environment.SERVER_URL +
       `/reform-service/reListAccessory/updateEnterpriseMsg?enterpriseMsgId=
       ${this.cache.get('entMsgInfo').id}&userId=${this.cache.get('userId')}`);
  }
}
