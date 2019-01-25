import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { retryWhen } from 'rxjs/operators';
import { CacheService } from '../../../core/cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class OnsiteService {
  progress;
  constructor(private http: HttpClient, private cache: CacheService) { }

  // allot 任务分配
  getAllotList(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/taskGroupTemp/findTaskGroupTempPageInfo', params);
  }
  // allot 获取核查项组
  getCheckGroup(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/checkItemGroup/findChkItemGro', params);
  }
  // allot 获取省级数据
  getProvincesData() {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findByRankNumAndPrentId',
      { 'parentId': '0', 'rankNum': '1', 'userId': this.cache.get('userId') });
  }
  // allot 获取市级数据
  getCitys(areaId) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findByRankNumAndPrentId',
      { 'parentId': areaId, 'rankNum': '2', 'userId': this.cache.get('userId') });
  }
  // allot 获取区级数据
  getDistricts(cityId) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findByRankNumAndPrentId',
      { 'parentId': cityId, 'rankNum': '3', 'userId': this.cache.get('userId') });
  }
  // allot 获取街道级数据
  getRoads(districtId) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findByRankNumAndPrentId',
      { 'parentId': districtId, 'rankNum': '4', 'userId': this.cache.get('userId') });
  }
  // allot 获取企业列表
  getEnterList(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/enterprise/findEnterList', params);
  }
  // allot 获取用户列表
  getUserList(params) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/user/findUserList', params);
  }

  // allot 发布选中任务
  postSelectedMission(tasksId) {
    return this.http.get(environment.SERVER_URL + `/on-site-inspect-service/task/insertBatchTask?userId=${this.cache.get('userId')}
    &tasksId=${tasksId}`);
  }
  // allot  创建任务
  insertTaskGroupTemp(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/taskGroupTemp/insertTaskGroupTemp', params);
  }
  // allot 删除任务
  delgroupTemp(taskId) {
    return this.http.get(environment.SERVER_URL
      + `/on-site-inspect-service/task/deleteTask?userId=${this.cache.get('userId')}&taskId=${taskId}`);
  }

  // checkplan 核查进度列表
  getCheckPlan(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/taskProcess/findTaskProcessList', params);
  }

  // checkgroup 核查项组列表
  getCheckGroupList(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/checkItemGroup/findChkItemGroPageInfo', params);
  }
  // checkgroup 核查项选项
  getCheckOptions() {
    return this.http.get(environment.SERVER_URL + '/on-site-inspect-service/checkItem/findChkItem?userId=' + this.cache.get('userId'));
  }
  // checkgroup 创建核查项
  postCheckOptions(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/checkItemGroup/insertChkItemGro', params);
  }
  // checkgroup 删除核查项
  delCheckOptions(id) {
    return this.http.get(
      environment.SERVER_URL + '/on-site-inspect-service/checkItemGroup/deleteChkItemGro?userId='
      + this.cache.get('userId') + '&id=' + id
    );
  }

  // checkresult 核查结果列表
  getCheckResultList(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/taskProcess/findCompanyProcessList', params);
  }
  // checkresultDetail  核查企业组结果详情
  CheckResultDetail(id, taskGroupId) {
    return this.http.get(
      environment.SERVER_URL + `/on-site-inspect-service/taskProcess/findItemList?userId=${id}&taskGroupId=${taskGroupId}`
    );
  }
  // checkresultCompanyMsg 核查企业结果详情
  checkresultCompanyMsg(id, taskGroupId) {
    return this.http.get(
      environment.SERVER_URL + `/on-site-inspect-service/taskProcess/findCompanyMsg?userId=${id}&taskGroupId=${taskGroupId}`
    );
  }
  // clueSubmission 获取线索报送列表
  getClueList(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/webReport/findMsgReportList', params);
  }
  // clueSubmission 获取线索报送详情
  getClueDetail(id) {
    return this.http.get(environment.SERVER_URL + `/on-site-inspect-service/webReport/selectByThreadId?threadId=${id}`);
  }
  // clueSubmission 获取线索报送详情文件列表
  getClueDetailFiles(id) {
    return this.http.get(environment.SERVER_URL + `/on-site-inspect-service/taskProcess/findAccessoryList?id=${id}`);
  }
  // clueSubmission 获取线索报送详情上传文件列表
  getClueDetailFilesList(id) {
    return this.http.get(environment.SERVER_URL + `/on-site-inspect-service/webReport/selectByReportId?reportId=${id}`);
  }
  // clueSubmission 上传线索报送文件到对应线索
  postFilesToClue(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/accessory/insertAccessory', params);
  }
  // clueSubmission 上传线索数据
  postClueData(params) {
    return this.http.post(environment.SERVER_URL + '/on-site-inspect-service/webReport/insertByThreadId', params);
  }

  // 文件上传
  reformFileUploadClip(file) {
    return this.http.post(environment.SERVER_URL + '/upload-file/uploadAppendAndConvert', file,
      { responseType: 'json', reportProgress: true });
  }

  // 删除上传文件
  delUploadedFile(userId, id) {
    return this.http.post(environment.SERVER_URL + `/on-site-inspect-service/accessory/deleteAccessory`, {...id});
  }
  // 文件上传（切片）
  reformFileUpload(file, id, getprogress?: any) {
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
    return this.postFile(Chunks, 0, id, getprogress);
  }
  postFile(files, i, id?: any, getprogress?: any) {
    const that = this;
    this.progress = (i / files.length) * 100;
    getprogress(this.progress);
    if (i < files.length) {
      const next = i + 1;
      this.reformFileUploadClip(files[i]).subscribe((res: any) => {
        console.log(res);
        if (i === 0) {
          this.fileToRole({
            body: res.body,
            name: files[i].get('filename')
          }, id).subscribe();
          files.map((item) => {
            item.set('fileId', res.body);
            return item;
          });
        }
        this.postFile(files, next, null, getprogress);
      });
    } else {
      return;
    }
  }
  getProgress() {
    return this.progress;
  }
  // 将上传文件存入到指定角色对应的字段
  public fileToRole(file, id) {
    console.log(file);
    const url = environment.SERVER_URL + '/on-site-inspect-service/accessory/insertAccessory';
    const params: any = {
      'fileSize': '',
      'id': '',
      'name': file.name,
      'position': '',
      'reportId': id,
      'status': '1',
      'type': file.name.split('.')[1],
      'url': file.body
    };
    //  {
    //   'fileSize': '',
    //   'fileType': '',
    //   'id': '',
    //   'res0': id,
    //   'name': file.name,
    //   'status': '1',
    //   'url': file.body,
    //   'createTime': new Date(),
    //   'userId': this.cache.get('userId'),
    // };
    return this.http.post(url, params);
  }
}
