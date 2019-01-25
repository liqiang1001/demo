import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, UploadFile } from 'ng-zorro-antd';
import { ReportService } from '../../report.service';

@Component({
  selector: 'file-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less']
})
export class UploadComponent implements OnInit {
  @Input() info: any;
  @Input() state: any;
  fileList: UploadFile;
  URL;
  constructor(private modal: NzModalRef, private http: ReportService) { }

  ngOnInit() {
    this.URL = this.http.uploadUrl;
    if (typeof this.info.value === 'string') {
      this.fileList = JSON.parse(this.info.value).map(i => {
        return {
          name: i.fileName,
          id: i.fileId,
          uid: i.fileId,
          status: 'done',
          type: 1
        };
      });
    }
    console.log(this.info);
  }

  preview = (file: UploadFile) => {
    console.log(file);
  }

  destroyModal(): void {
    const files = this.fileList.map(item => {
      if (item.type === 1) {
        return {
          fileName: item.name,
          fileId: item.id
        };
      } else {
        return {
          fileName: item.name,
          fileId: item.response.body
        };
      }

    });
    this.modal.destroy({
      data: files
    });
  }

  cancelModal() {
    this.modal.destroy();
  }
}
