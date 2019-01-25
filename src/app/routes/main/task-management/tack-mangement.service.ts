import { Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd';



@Injectable({
  providedIn: 'root'
})

export class TackMangementService {
  progress;
  fileIds;
  constructor(private http: HttpClient,
    private message: NzMessageService,
  ) { }

  // 获取表格数据
  getTable(params) {
    return this.http.post(environment.SERVER_URL + '/off-site-inspect-service/taskManager/findTaskList', params);
  }
  // 创建填报任务
  getAreaAndType(params) {
    return this.http.post(environment.SERVER_URL + '/off-site-inspect-service/taskManager/queryFormListByAreaAndType', params);
  }
  // 获取详情弹框
  getTaskId(id) {
    return this.http.get(environment.SERVER_URL + `/off-site-inspect-service/taskManager/findByTaskId?taskId=${id}`);
  }

  // 下载文件
  fileDownLoad(id, name) {
    const uA = window.navigator.userAgent;
    const isIE = /msie\s|trident\/|edge\//i.test(uA) && !!('uniqueID' in document ||
      'documentMode' in document || ('ActiveXObject' in window) || 'MSInputMethodContext' in window);
    this.http.get(environment.SERVER_URL + `/upload-file/download/${id}`).subscribe((res: any) => {
      const blob = new Blob([res], { type: '' });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = name;
      document.body.appendChild(a);
      a.setAttribute('id', 'download');
      if (isIE) {
        // 兼容IE11无法触发下载的问题
        navigator.msSaveBlob(blob, name);
      } else {
        a.click();
      }
      // 触发下载后再释放链接
      a.addEventListener('click', function () {
        URL.revokeObjectURL(objectUrl);
        document.getElementById('download').remove();
      });

    });
  }
  reformFileUpload(file, id, type, getprogress?: any, getfileids?: any) {
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
    return this.postFile(Chunks, 0, id, type, getprogress, getfileids);
  }

  postFile(files, i, id?: any, type?: any, getprogress?: any, getfileids?: any) {
    const that = this;
    this.progress = (i / files.length) * 100;
    getprogress(this.progress);
    if (i < files.length) {
      const next = i + 1;
      this.reformFileUpload1(files[i]).subscribe((res: any) => {
        this.fileIds = res.body;
        getfileids(this.fileIds);
        this.postFile(files, next, null, null, getprogress, getfileids);
      });
    } else {
      this.message.success('上传成功');
      return;
    }
  }
  getProgress() {
    return this.progress;
  }
  getFileIds() {
    return this.fileIds;
  }

  // 文件上传
  reformFileUpload1(file) {
    return this.http.post(environment.SERVER_URL + '/upload-file/upload', file,
      { responseType: 'json', reportProgress: true });
  }


  // 非现场任务记录
  getEnterpriseList(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/findEnterpriseList`, params);
  }
  // 批量删除
  batchDelEnterprise(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/batchDelEnterprise`, params);
  }
  // 批量添加
  addTask(id) {
    return this.http.get(environment.SERVER_URL + `/off-site-inspect-service/taskManager/findNonTaskEnterpriseList?taskId=${id}`);
  }
  addEnterprise(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/batchAddEnterprise`, params);
  }
  // 发布任务
  issueTask(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/issueTask`, params);
  }
  // 关闭任务
  closeTask(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/closeTask`, params);
  }
  // 删除任务
  removeTask(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/removeTask`, params);
  }

  // 获取图表信息
  getSubMission(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/submissionEntNum`, params);
  }
  // 任务进度详情表格
  getDetailsList(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/findScheduleDetailsList`, params);
  }
  // 导出
  export(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/exportScheduleDetailsList`, params, {
      responseType: 'blob'
    });
  }
  // 批量通知
  entInform(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/entInform`, params);
  }

  // 创建任务
  creatTask(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/addTask`, params);
  }
  // 修改任务
  editTask(params) {
    return this.http.post(environment.SERVER_URL + `/off-site-inspect-service/taskManager/editTask`, params);
  }
  getTree(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/areaManager/findTree`, params);
  }





}
