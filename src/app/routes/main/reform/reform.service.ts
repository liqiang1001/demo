import { Injectable } from '@angular/core';
import { CacheService } from '../../../core/cache/cache.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReformService {
  roleList: any = {
    admin: '现场政府管理员',
    lawyer: '律师',
    account: '会计师',
    trial: '形式审核初审小组'
  };
  progress;

  constructor(private http: HttpClient, private cache: CacheService) { }
  // 获取当前角色
  isGov() {
    const currentRole = this.cache.get('userData').roleNames;
    return currentRole.indexOf(this.roleList.admin) >= 0;
  }
  isLawyer() {
    const currentRole = this.cache.get('userData').roleNames;
    return currentRole.indexOf(this.roleList.lawyer) >= 0;
  }
  isAccout() {
    const currentRole = this.cache.get('userData').roleNames;
    return currentRole.indexOf(this.roleList.account) >= 0;
  }
  isTrial() {
    const currentRole = this.cache.get('userData').roleNames;
    return currentRole.indexOf(this.roleList.trial) >= 0;
  }
  // reformcheck 获取审批列表
  getReformList(params) {
    let url = environment.SERVER_URL;
    if (this.isGov()) {
      url += '/reform-service/reGovTrial/findGovTrialList';
      params.govTrialStatus = params.param2;
    } else if (this.isLawyer()) {
      url += '/reform-service/reLawyerTrial/findLawyerTrialList';
      params.lawyerTrialStatus = params.param2;
    } else if (this.isAccout()) {
      url += '/reform-service/reAccountTrial/findAccountTrialList';
      params.accountTrialStatus = params.param2;
    } else if (this.isTrial()) {
      url += '/reform-service/reFirstTrial/findFirstTrialList';
      params.firstTrialStatus = params.param2;
    }

    return this.http.post(url, params);
  }

  getFundList() {
    return this.http.post(environment.SERVER_URL + '/reform-service/dict/findFundSizeList', {});
  }
  // 获取企业信息
  getEntInfo(id) {
    return this.http.get(environment.SERVER_URL + `/reform-service/enterprise/selectByMsgId?MsgId=${id}`);
  }
  // 获取受理申请书
  getRequsetion(id) {
    return this.http.post(environment.SERVER_URL + '/reform-service/reFirstTrial/findFirstThreeReList', { enterpriseMsgId: id });
  }
  // 获取资料清单核查tab
  getTab(id) {
    return this.http.get(environment.SERVER_URL + `/reform-service/dict/findEnterTab?enterpriseMsgId=${id}`);
  }
  // 获取资料清单tab具体内容
  getTabDetail(params) {
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/findReListList`, params);
  }
  // 获取单项文件列表
  getItemFiles(id, itemid) {
    const that = this;
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/findEveryReList`, {
      'enterpriseMsgId': id,
      'dictId': itemid,
      'status': '1',
      'userId': that.cache.get('userId')
    });
  }
  // 108项保存
  reformSave(id, param) {
    let url = environment.SERVER_URL;
    const params: any = {
      enterpriseMsgId: id,
    },
      that = this;
    if (this.isGov()) {
      url += '/reform-service/reGovTrial/govTrialSave';
      params.govTrialRecommon = param.first;
      params.rectificationEnterCheckVerifi = param.second;
      params.govTrialPerson = that.cache.get('userId');
    } else if (this.isLawyer()) {
      url += '/reform-service/reLawyerTrial/lawyerTrialSave';
      params.lawyerTrialRecommon = param.first;
      params.rectificationEnterCheckVerifi = param.second;
      params.lawyerTrialPerson = that.cache.get('userId');
    } else if (this.isAccout()) {
      url += '/reform-service/reAccountTrial/accountTrialSave';
      params.accountTrialRecommon = param.first;
      params.rectificationEnterCheckVerifi = param.second;
      params.accountTrialPerson = that.cache.get('userId');
    } else if (this.isTrial()) {
      url += '/reform-service/reFirstTrial/firstTrialSave';
      params.firstTrialRecommen = param.first;
      params.rectificationEnterCheckVerifi = param.second;
      params.firstTrialResult = param.third;
      params.firstTrialPerson = that.cache.get('userId');
    }
    // console.log(params);
    return this.http.post(url, params);
  }

  // 108项提交
  reformCommit(id, param) {
    let url = environment.SERVER_URL;
    const params: any = {
      enterpriseMsgId: id,
    };
    if (this.isGov()) {
      url += '/reform-service/reGovTrial/govTrialSubmit';
      params.govTrialRecommon = param.first;
      params.rectificationEnterCheckVerifi = param.second;
      params.govTrialPerson = this.cache.get('userId');
    } else if (this.isLawyer()) {
      url += '/reform-service/reLawyerTrial/lawyerTrialSubmit';
      params.lawyerTrialRecommon = param.first;
      params.rectificationEnterCheckVerifi = param.second;
      params.lawyerTrialPerson = this.cache.get('userId');
    } else if (this.isAccout()) {
      url += '/reform-service/reAccountTrial/accountTrialSubmit';
      params.accountTrialRecommon = param.first;
      params.rectificationEnterCheckVerifi = param.second;
      params.accountTrialPerson = this.cache.get('userId');
    } else if (this.isTrial()) {
      url += '/reform-service/reFirstTrial/firstTrialSubmit';
      params.firstTrialRecommen = param.first;
      params.rectificationEnterCheckVerifi = param.second;
      params.firstTrialResult = param.third;
      params.firstTrialPerson = this.cache.get('userId');
    }
    // console.log(params);
    return this.http.post(url, params);
  }
  // 预览pdf文件
  previewPDF(url) {
    return window.open(environment.SERVER_URL + '/upload-file/officePreviewPdf?fileId=' + url);
  }
  // 查询已上传文件列表
  findUploaded(id, type) {
    const params: any = {
      enterpriseMsgId: id
    };
    // 政府
    if (type === 'p2p') {
      params.fileDepend = '10';
    }
    // 律师
    if (type === 'law_result') {
      params.fileDepend = '7';
    }
    if (type === 'law_pencil') {
      params.fileDepend = '8';
    }
    // 会计
    if (type === 'kj_result') {
      params.fileDepend = '4';
    }
    if (type === 'kj_pencil') {
      params.fileDepend = '5';
    }
    if (type === 'xs_first') {
      params.fileDepend = '2';
    }
    if (type === 'online') {
      params.fileDepend = '12';
    }

    return this.http.post(environment.SERVER_URL + '/reform-service/reFirstTrial/findReAccessoryList', params);
  }

  // 文件上传
  reformFileUpload1(file) {
    return this.http.post(environment.SERVER_URL + '/upload-file/uploadAppendAndConvert', file,
      { responseType: 'blob', reportProgress: true });
  }

  // 删除上传文件
  delUploadedFile(userId, id) {
    return this.http.get(environment.SERVER_URL + `/reform-service/reAccessory/deleteReAccessory?userId=${userId}&id=${id}`);
  }

  reformFileUpload(file, id, type, getprogress?: any) {
    const size = file.file.size;  // 文件大小
    const chunkSize = 1024 * 1024 * 2;  // 切片大小
    const maxChunk = Math.ceil(size / chunkSize);
    const Chunks = Array(maxChunk).fill(0).map((item: {}, index) => {
      const formData = new FormData();
      formData.append('file', file.file.slice(index * chunkSize, (index + 1) * chunkSize));
      formData.append('filename', file.file.name);
      formData.append('block', (index + 1).toString());
      formData.append('blobname', index.toString());
      formData.append('fileId', '');
      formData.append('totleNum', maxChunk.toString());
      return formData;
    });
    return this.postFile(Chunks, 0, id, type, getprogress);
  }

  postFile(files, i, id?: any, type?: any, getprogress?: any) {
    const that = this;
    this.progress = (i / files.length) * 100;
    getprogress(this.progress);
    if (i < files.length) {
      const next = i + 1;
      this.reformFileUpload1(files[i]).subscribe((res: any) => {
        console.log(res);
        if (i === 0) {
          this.fileToRole({
            body: res.body,
            name: files[i].get('filename')
          }, id, type).subscribe();
          files.map((item, index) => {
            item.set('fileId', res.body);
            return item;
          });
        }
        this.postFile(files, next, null, null, getprogress);
      });
    } else {
      return;
    }
  }
  getProgress() {
    return this.progress;
  }
  // 将上传文件存入到指定角色对应的字段
  public fileToRole(file, id, type) {
    let url = environment.SERVER_URL;
    const params: any = {
      'enterpriseMsgId': id,
      'fileSize': '',
      'fileType': '',
      'id': '',
      'res0': id,
      'name': file.name,
      'status': '1',
      'url': file.body,
      'createTime': new Date(),
      'userId': this.cache.get('userId'),
    };
    const that = this;
    // 政府
    if (type === 'p2p') {
      url += '/reform-service/reGovTrial/insertGovTalk';
      params.fileDepend = '10';
    }
    // 律师
    if (type === 'law_result') {
      // reFirstTrial/findReAccessoryList
      url += '/reform-service/reLawyerTrial/insertReAccessory';
      params.fileDepend = '7';
    }
    if (type === 'law_pencil') {
      url += '/reform-service/reLawyerTrial/insertLawyerTalk';
      params.fileDepend = '8';
    }
    // 会计
    if (type === 'kj_result') {
      url += '/reform-service/reAccountTrial/insertReAccessory';
      params.fileDepend = '4';
    }
    if (type === 'kj_pencil') {
      url += '/reform-service/reAccountTrial/insertAccountTalk';
      params.fileDepend = '5';
    }
    if (type === 'xs_first') {
      url += '/reform-service/reFirstTrial/insertFirstTalk';
      params.fileDepend = '2';
    }
    if (type === 'online') {
      url += '/reform-service/reGovTrial/insertGovOnline';
      params.fileDepend = '12';
    }

    return this.http.post(url, params);
  }

  // 查询审核信息

  findReformMessage(id) {
    let url = environment.SERVER_URL;
    const params: any = {
      enterpriseMsgId: id,
    };
    if (this.isGov()) {
      url += '/reform-service/reGovTrial/findInspectMsg';
    } else if (this.isLawyer()) {
      url += '/reform-service/reLawyerTrial/findInspectMsg';
    } else if (this.isAccout()) {
      url += '/reform-service/reAccountTrial/findInspectMsg';
    } else if (this.isTrial()) {
      url += '/reform-service/reFirstTrial/findInspectMsg';
    }
    // console.log(params);
    return this.http.post(url, params);
  }


  // ********************workallot-check
  // 获取区列表
  getDistricts(id) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findTree', { id: id });
  }
  getAllocationList(params) {
    return this.http.post(environment.SERVER_URL + '/reform-service/reTaskAllocation/findAllocationList', params);
  }
  // 创建按钮
  // 获取核查组名称列表
  getcheckGroup() {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/user/listFirstTrialUser`);
  }
  // 获取会计选择列表
  getAccountList(enterpriseIds) {
    return this.http.get(environment.SERVER_URL + `/reform-service/reTaskAllocation/findAccountList?enterpriseIds=${enterpriseIds}`);
  }
  // 获取律师选择列表
  getLawyerList(enterpriseIds) {
    return this.http.get(environment.SERVER_URL + `/reform-service/reTaskAllocation/findLawyerList?enterpriseIds=${enterpriseIds}`);
  }
  // 获取企业列表
  getEnterpriseList(name, cityId) {
    return this.http.post(environment.SERVER_URL + '/reform-service/reTaskAllocation/findEnterpriseDistrict', {
      name: name, districtId: cityId
    });
  }
  // 获取会所/律所列表
  getClubUserList(id) {
    return this.http.get(environment.SERVER_URL + `/reform-service/reTaskAllocation/findClubUserList?id=${id}`);
  }
  // 审查人列表
  getGovUserList(id, name) {
    return this.http.get(environment.SERVER_URL + `/reform-service/reTaskAllocation/findGovUserList?districtId=${id}&name=${name}`);
  }
  // 创建任务分配
  // 协会创建
  creatreform(ids, groupId) {
    return this.http.post(environment.SERVER_URL +
      '/reform-service/reTaskAllocation/firstTrialAssignTask?enterpriseMsgIds=' + ids
      + '&firstTrialUserIds=' + groupId + '&userId=' + this.cache.get('userId'), {});
  }
  // 政府创建
  creatreform2(params) {
    return this.http.post(environment.SERVER_URL + `/reform-service/reTaskAllocation/fieldInspection`, params);
  }
  // 档案详情
  // 受理申请书
  getFourReList(params) {
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/findFourReList`, params);
  }

  // 108 详情
  getInspectMsg(item, params) {
    return this.http.post(environment.SERVER_URL + `/reform-service/${item}/findInspectMsg`, params);
  }

  // reFirstTrial

  // 资料清单
  getReListList(params) {
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/findReListList`, params);
  }
  getFirstThreeReList(params) {
    return this.http.post(environment.SERVER_URL + `/reform-service/reFirstTrial/findFirstThreeReList`, params);
  }
  // 获取企业信息
  getselectByMsgId(id) {
    return this.http.get(environment.SERVER_URL + `/reform-service/enterprise/selectByMsgId?MsgId=${id}`);
  }

  // 预览
  // 获取文件列表
  checkFileslist(params) {
    return this.http.post(environment.SERVER_URL + `/reform-service/reListAccessory/findEveryReList`, params);
  }
  previewPNG(url) {
    return this.http.get(environment.SERVER_URL + '/upload-file/download/' + url);
    // return window.open(environment.SERVER_URL + '/upload-file/download/' + url);
  }

  // 108 获取预览文件
  ReAccessoryList(params) {
    return this.http.post(environment.SERVER_URL + `/reform-service/reFirstTrial/findReAccessoryList`, params);
  }
  // 下载文件
  fileDownLoad(id) {
    return this.http.get(environment.SERVER_URL + `/upload-file/download/${id}`);
  }
  // 上传文件 类型 image/jpeg |text/plain
  reformUpload(file) {
    const formData = new FormData();
    formData.append('file', file as any);
    // tslint:disable-next-line:no-unused-expression
    const req = new HttpRequest('POST', environment.SERVER_URL + '/upload-file/upload', formData, {
      reportProgress: true,
      withCredentials: true
    });
    return this.http.request(req);
  }
  // 企业类型查询
  getenterType(userId) {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/dictManager/findUserTypeByUserId?userId=${userId}`);
  }
  // ********************workallot-check
}
