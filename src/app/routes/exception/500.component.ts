import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'exception-500',
  template: `<h1>服务器错误，请返回刷新页面</h1>`,
  // template: `<exception type="500" style="min-height: 500px; height: 80%;"></exception>`,
})
export class Exception500Component {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
