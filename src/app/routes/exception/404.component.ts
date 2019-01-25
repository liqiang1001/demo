import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'exception-404',
  // template: `<exception type="404" style="min-height: 500px; height: 80%;"></exception>`,
  template: `<div class="box">
  <div>
      <img src="assets/image/404.png" alt="">
      <h1>很抱歉，您要访问的页面不存在！</h1>
  </div>

</div>`,
  styleUrls: ['./exception.component.less']
})
export class Exception404Component {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
