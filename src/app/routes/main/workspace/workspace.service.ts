import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private http: HttpClient) { }

  // workspace 新建工作记录
  createNewRecord(params) {
    return this.http.post(environment.SERVER_URL + '/work-record-service/workRecord/selfAddRecord', params);
  }
  // workrecord 查询企业建议
  getEntSuggest(value) {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/enterpriseUser/getEnterListByName?name=${value}`);
  }
  // workrecord 获取工作记录列表
  getRecordList(params) {
    return this.http.post(environment.SERVER_URL + '/work-record-service/workRecord/selectRecordList', params);
  }
  // workDetail 查询工作记录
  getRecordItem(id) {
    return this.http.get(environment.SERVER_URL + `/work-record-service/workRecord/selectRecordByPrimaryKey/${id}`);
  }
  // workrecord 删除工作记录
  delRecordItem(id) {
    return this.http.post(environment.SERVER_URL + '/work-record-service/workRecord/deleteRecord', [id]);
  }
  // workdetail 修改工作记录
  updataRecordItem(params) {
    return this.http.post(environment.SERVER_URL + '/work-record-service/workRecord/updateRecord', params);
  }
  // workdetail 根据企业id查询工作组
  getWorkGroup(params) {
    return this.http.post(environment.SERVER_URL + '/work-record-service/excel/findWorkInfo', params);
  }
  // workspace 导出
  exportFile() {
    return this.getEntSuggest(environment.SERVER_URL + '/work-record-service/excel/exportExcel');
  }
  // workspace 上传
  FileUpload(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workType', type.workType);  // 工作类型
    formData.append('groupType', type.groupType); // 人员类型
    return this.http.post(environment.SERVER_URL + '/work-record-service/excel/importExcel', formData,
      { responseType: 'json', reportProgress: true });
  }
  // 查询详情字段
  getDetailConfig(params) {
    return this.http.post(environment.SERVER_URL + '/work-record-service/config/select', params);
  }

  readCrad() {
    return window.fetch('http://127.0.0.1:8001/read-id-card');
  }
  // 获取企业备忘录列表
  getSelectRecordList(params) {
    return this.http.post(environment.SERVER_URL + '/work-record-service/workRecord/selectRecordList', params);
  }

  // 获取上访列表
  getVisitorsList(params) {
    return this.http.post(environment.SERVER_URL + '/work-record-service//complainerVisitor/selectVisitorsList', params);
  }
  // 获取上访详情
  getVisitorsDetail(serialNumber) {
    return this.http.post(environment.SERVER_URL +
      `/work-record-service/complainerVisitor/selectVisitorsDetail?serialNumber=${serialNumber}`, { serialNumber: serialNumber });
  }
  // 点击拍照
  takePhoto(userId) {
    // return this.http.get(environment.SERVER_URL + `/work-record-service/complainerVisitor/takePicture?userId=${userId}`
    return this.http.get(environment.SERVER_URL + `/work-record-service/complainerVisitor/takePicture?userId=temp`
    );
  }
  // 上传图片
  reformUpload(file) {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('fileId', '');
    formData.append('block', '1');
    formData.append('blobname', '1');
    formData.append('totleNum', '1');
    console.log(formData);
    return this.http.post(environment.SERVER_URL + '/upload-file/uploadAppendAndConvert', formData);
  }
  // 图片地址传文件
  urlToFile(url) {
    this.http.jsonp(url, 'callback').subscribe((res: any) => {
      console.log(res);
      // const blob = new Blob([res], {
      //   type: 'application/json'
      // });
      const formData = new FormData();
      // formData.append('file', blob as any);
      console.log(formData);
      return formData;
    });
  }
  // 将url 转化为base64
  // tslint:disable-next-line:no-shadowed-variable
  getBase64ByImgUrl(url: string, callback: (arg0: string) => void) {
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg');
      console.log('base64-dataUrl: ', dataURL);
      callback(dataURL);
      canvas = null;
    };
    // url = '/img-file/' + url;
    img.src = url;
  }
  // 将base64转换为文件流
  getFileByBase64(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
