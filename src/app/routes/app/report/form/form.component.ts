import { Component, OnInit, Input, TemplateRef, EventEmitter, Output } from '@angular/core';
import { ReportService } from '../report.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { DictService } from 'src/app/core/dict/dict.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class FormComponent implements OnInit {
  @Input() Form;
  @Input() FormId;
  @Input() State;
  @Input() FormType;
  @Output() FormChange = new EventEmitter();
  confirmModal: NzModalRef;
  tplModal: NzModalRef;
  requestCause;
  constructor(
    private http: ReportService,
    private cache: CacheService,
    private dict: DictService,
    private msg: NzMessageService,
    private modal: NzModalService) { }

  ngOnInit() { }

  setValue(val, item) {
    if (item.dictType === 'whether' && item.constrainFields) {
      this.Form.forEach(i => {
        item.constrainFields.split(',').forEach(k => {
          if (i.fieldName === k) {
            i.isShow = item.dictType === 'whether' && val === '6/1';
          }
        });
      });
    }

    item.value = val;
    console.log(val.toString());
    if (!!item.dictType) {
      item.selectOpt = this.dict.get(item.dictType).filter(i => {
        return val.indexOf(i.id) >= 0;
      });
    }
  }

  // 保存
  public saveForm(status) {
    // 基本内容
    const json = {
      'userId': this.cache.get('userId'),
      'enterId': this.cache.get('userId'),
      'tableName': this.cache.get('formInfo').formInfo.tableName,
      'reportId': this.cache.get('formInfo').formList.length > 0 ? this.cache.get('formInfo').formList[0].reportId : ''
    };
    let isOk = true;
    // 表单内容
    this.Form.forEach(element => {
      // 必填验证
      if (status === 1 && element.isShow && element.must === '1' && !element.value) {
        isOk = false;
        return this.msg.error(element.showName + '是必填项！');
      }
      if (this.FormType === '3' && element.isShow && element.must === '1' && !element.value) {
        isOk = false;
        return this.msg.error(element.showName + '是必填项！');
      }
      if (!element.isShow) {
        element.value = element.isShow ? element.value : '';
      }
      // 类型检查
      if (element.value) {
        const num = element.value.toString();
        const p = num.indexOf('.') + 1;
        switch (element.type) {
          case 1:
            if ((num.length - p) > element.length) {
              isOk = false;
              this.msg.warning(element.showName + '长度为' + element.length + '位');
            }

            break;
          case 6:
            if (p > 0) {
              if ((num.length - p) > element.length) {
                isOk = false;
                this.msg.warning(element.showName + '小数点后最后' + element.length + '位');
              }
            }
            break;
          case 4:
            if (p > 0) {
              if ((num.length - p) > 0) {
                isOk = false;
                this.msg.warning(element.showName + '必须为整数');
              }
            }
            break;
        }
      }


      // 修改表单字典结构
      if (!!element.dictType && element.selectOpt) {
        json[element.fieldName] = element.selectOpt ? element.selectOpt : [];
      } else {
        json[element.fieldName] = element.value ? element.value : null;
      }
    });
    if (status === 1 && this.FormType === '3' && this.cache.get('formInfo').formList.length === 0) {
      return this.msg.error('请先添加一条记录！');
    }
    if (isOk) {
      this.http.fillForm({
        fillStatus: status,
        json: JSON.stringify({ id: this.FormId, ...json })
      }).subscribe(res => {
        if (status === 0) {
          this.msg.success('企业保存成功');
        } else {
          this.msg.success('企业填报成功');
        }
        this.FormChange.emit();
      });
    }
  }

  // 变更
  changeForm(tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>) {
    this.confirmModal = this.modal.confirm({
      nzTitle: '通知',
      nzContent: `尊敬的用户：您好！历史数据变更线上申请已提交完成。现在新增修改历史数据线下审批流程：若机构需要修改历史数据，请阐述修改原因和需要修改的数据情况，由法人签字盖章
      ，加盖企业公章 → 发送至所在区金融办审批 → 区金融办报送市金融局 → 市金融局审批后企业可在金管通进行线上变更。`,
      nzOnOk: () => {
        this.tplModal = this.modal.create({
          nzTitle: '变更申请',
          nzContent: tplContent,
          nzFooter: tplFooter,
          nzMaskClosable: false,
          nzClosable: false,
        });
      }
    });
  }

  changeFormServe() {
    if (!!this.requestCause) {
      this.http.changeForm({
        id: this.cache.get('formInfo').formList[0].reportId,
        requestCause: this.requestCause
      }).subscribe(res => {
        this.msg.success('表单变更申请成功');
        this.FormChange.emit();
        this.tplModal.destroy();
      }, error => {
        console.log(error);
      });
    } else {
      this.msg.error('请填写变更理由');
    }
  }

  destroyTplModal(): void {
    this.tplModal.destroy();
  }
}
