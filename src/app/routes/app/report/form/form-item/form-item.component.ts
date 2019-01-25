import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DictService } from 'src/app/core/dict/dict.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UploadComponent } from '../../shared/upload/upload.component';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.less']
})
export class FormItemComponent implements OnInit {
  @Input() item;
  @Input() State;
  @Output() valueChange = new EventEmitter();
  DictOpts;
  fileLength = 0;
  constructor(private dict: DictService, private msg: NzMessageService, private modalService: NzModalService) { }

  ngOnInit() {
    this.dictFormat();

  }

  // 处理字典
  dictFormat() {
    switch (this.item.type) {
      case 2:
        if (this.item.value && this.item.value.indexOf('[') === 0) {
          this.fileLength = JSON.parse(this.item.value).length;
        }
        break;
      case 5:
      case 7:
        // 多选，单选字典
        this.DictOpts = this.dict.get(this.item.dictType);
        setTimeout(() => {
          let olds;
          this.DictOpts = this.dict.get(this.item.dictType);
          // 多选，单选回写
          if (this.item.value) {
            if (this.item.value.indexOf('{') === 0) {
              olds = JSON.parse(this.item.value).id;
            } else if (this.item.value.indexOf('[') === 0) {
              olds = JSON.parse(this.item.value).map(i => i.id);
            } else {
              olds = null;
            }
            this.item.selectOpt = JSON.parse(this.item.value);
          }
          this.item.value = olds;
        }, 500);
        break;
    }
  }
  valChange(e) {
    const num = e ? e.toString() : e;
    const p = num.indexOf('.') + 1;
    // 根据类型进行写值
    switch (this.item.type) {
      case 6:
        if (this.item.type === 6 && p > 0) {
          if ((num.length - p) > this.item.length) {
            this.msg.warning(this.item.showName + '小数点后最后' + this.item.length + '位');
          }
        }
        break;
      case 4:
        if (p > 0) {
          if ((num.length - p) > 0) {
            this.msg.warning(this.item.showName + '必须为整数');
          }
        }
        break;
    }
    this.valueChange.emit(e);
    // this.item.value = e;
  }

  createFileModal(): void {
    const modal = this.modalService.create({
      nzTitle: '文件上传',
      nzContent: UploadComponent,
      nzComponentParams: {
        info: this.item,
        state: this.State
      },
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.fileLength = result.data.length;
        this.valueChange.emit(this.fileLength === 0 ? '[]' : JSON.stringify(result.data));
      }
    });
  }


  log(e) {
    console.log(e);
  }

}
