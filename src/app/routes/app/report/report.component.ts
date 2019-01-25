import { Component, OnInit, OnDestroy } from '@angular/core';
import { CacheService } from 'src/app/core/cache/cache.service';
import { ReportService } from './report.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit, OnDestroy {
  TaskInfo;
  TaskMenu;
  Form;
  FormId;
  FormStatu;
  Comment;
  ItemForm;
  FormList;
  constructor(private cache: CacheService, private http: ReportService, private msg: NzMessageService) { }

  ngOnInit() {
    if (this.cache.get('HistaskInfo')) {
      this.TaskInfo = {
        ...this.cache.get('taskInfo'), ...{
          batchId: this.cache.get('HistaskInfo').batchEnterpriseId,
          id: this.cache.get('HistaskInfo').taskId
        }
      };
    } else {
      this.TaskInfo = this.cache.get('taskInfo');
    }
    this.getTaskMenu(this.getForm);
  }

  refreshState() {
    this.getTaskMenu(this.getForm);
    this.FormId = null;
  }

  getTaskMenu(fn) {
    this.http.getTaskMenu(this.TaskInfo).subscribe((res: any) => {
      this.TaskMenu = res;
      if (fn) {
        fn.call(this, this.cache.get('tabInfo') || res[0]);
      }
    });
  }

  activeMenu(i) {
    this.TaskMenu = this.TaskMenu.map(u => {
      u.taskSelected = u.formName === i.formName;
      return u;
    });
  }

  getForm(item) {
    this.activeMenu(item);
    this.ItemForm = item;
    console.log(item);
    this.cache.set('tabInfo', item);
    const param = {
      tableName: item.tableName,
      batchId: this.TaskInfo.batchId,
      formId: item.id,
      id: this.TaskInfo.id,
    };

    // 获取表达详情
    this.http.getForm(param).subscribe((res: any) => {
      this.cache.set('formInfo', res);
      // 初始化表单内容
      const arr = [], arr1 = [];
      if (this.ItemForm.formType === '1') {
        for (const key in res.fieldList) {
          if (res.fieldList.hasOwnProperty(key)) {
            const element = {
              value: res.formList.length > 0 ? JSON.parse(JSON.stringify(res.formList[0][key])) : '',
              index: res.fieldList[key].sortIndex,
              ...res.fieldList[key]
            };
            if (element.index) {
              arr[element.index - 1] = element;
            } else {
              arr.push(element);
            }
          }
        }
      } else if (this.ItemForm.formType === '3') {
        for (const key in res.fieldList) {
          if (res.fieldList.hasOwnProperty(key)) {
            const element = {
              value: '',
              index: res.fieldList[key].sortIndex,
              ...res.fieldList[key]
            };
            if (element.index) {
              arr[element.index - 1] = element;
            } else {
              arr.push(element);
            }
          }
        }
      }
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element) {
          if (element.dictType === 'whether' && element.constrainFields) {
            element.isShow = true;
            // tslint:disable-next-line:max-line-length
            element.value = '[{"val":"6/1","name":"是","descriprion":"是否","delFalg":"0","sort":1,"id":"6/1","type":"whether","parentId":"6"}]';
          } else {
            element.isShow = true;
          }
          arr1.push(element);
        }
      }
      console.log(arr1);
      // 多记录表单列表
      this.FormList = res.formList;
      this.Form = arr1;
      this.FormId = (res.formList.length === 1 && this.ItemForm.formType === '1') ? res.formList[0].id : null;
      this.FormStatu = !!res.formStatus;
      // 表单填报说明
      this.Comment = this.Form.filter(I => I.comment !== '无');
    });
  }

  // 多记录编辑
  polyFormToggle(data) {

    const Form = this.Form.map(element => {
      try {
        const val = JSON.parse(data[element.fieldName]);
        if (data[element.fieldName].indexOf('[') >= 0) {
          element.value = [...val].map(i => i.id);
        } else if (data[element.fieldName].indexOf('{') >= 0) {
          element.value = val.id;
        } else {
          element.value = data[element.fieldName];
        }
      } catch (error) {
        element.value = data[element.fieldName];
      }
      return element;
    });
    this.Form = Form;
    // tslint:disable-next-line:max-line-length
    if (data.is_exist === '[{"val":"6/2","name":"否","descriprion":"是否","delFalg":"0","sort":2,"id":"6/2","type":"whether","parentId":"6"}]') {
      this.Form.forEach(element => {
        element.isShow = element.fieldName === 'is_exist';
      });
    }
    this.FormId = data.id;
  }

  delPolyForm(data) {
    this.http.delArrForm({
      formId: this.ItemForm.id,
      id: data.id
    }).subscribe(res => {
      this.msg.success('记录删除成功！');
      this.refreshState();
    });
  }

  polySubmit() {
    if (this.FormList.length > 0) {
      this.http.fillForm({
        fillStatus: 1,
        json: JSON.stringify({
          'userId': this.cache.get('userId'),
          'enterId': this.cache.get('userId'),
          'tableName': this.cache.get('formInfo').formInfo.tableName,
          'reportId': this.cache.get('formInfo').formList.length > 0 ? this.cache.get('formInfo').formList[0].reportId : ''
        })
      }).subscribe(res => {
        this.msg.success('企业填报成功');
        this.refreshState();
      });
    } else {
      this.msg.error('至少提交一条记录！');
    }
  }
  // 离开时销毁缓存数据
  ngOnDestroy() {
    sessionStorage.removeItem('HistaskInfo');
    sessionStorage.removeItem('taskInfo');
    sessionStorage.removeItem('formInfo');
  }

}
