import { Component, OnInit } from '@angular/core';
import { CacheService } from 'src/app/core/cache/cache.service';
import { SaveService } from 'src/app/core/save/save.service';
import { ActivatedRoute, Params } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.less']
})
export class WorkspaceComponent implements OnInit {

  constructor(
    private cache: CacheService,
    private save: SaveService,
    private activatedRouter: ActivatedRoute,
    private net: WorkspaceService,
    private moda: NzModalService) {
  }
  info = true;
  info1;
  info2;
  userData;
  checkType;
  companyName;
  companyId;
  types1;
  types = [
    {
      name: '整改',
      value: 'GovWorkType1',
      items: [
        {
          name: '工作预案',
          icon: 'copy',
          value: 'GovDLWorkType1',
          path: 'workRecord'
        },
        {
          name: '工作记录',
          icon: 'form',
          value: 'GovDLWorkType2',
          path: 'workRecord'
        },
        // {
        //   name: '进度更新',
        //   icon: 'file-sync',
        //   value: 'GovDLWorkType3',
        //   path: 'workRecord'
        // },
      ]
    },
    {
      name: '退出',
      value: 'GovWorkType2',
      items: [
        {
          name: '退出方案',
          icon: 'export',
          value: 'GovDLWorkType4',
          path: 'workPlan'
        },
        {
          name: '工作记录',
          icon: 'form',
          value: 'GovDLWorkType2',
          path: 'workPlan'
        },
        {
          name: '进度更新',
          icon: 'file-sync',
          value: 'GovDLWorkType3',
          path: 'workPlan'
        },
      ]
    },
    {
      name: '风险处置',
      value: 'GovWorkType3',
      items: [
        {
          name: '工作预案',
          icon: 'copy',
          value: 'GovDLWorkType1',
          path: 'launchplan'
        },
        {
          name: '工作记录',
          icon: 'form',
          value: 'GovDLWorkType2',
          path: 'launchplan'
        },
        {
          name: '进度更新',
          icon: 'file-sync',
          value: 'GovDLWorkType3',
          path: 'launchplan'
        },
      ]
    },
    {
      name: '企业约谈',
      value: 'GovWorkType4',
      items: [
        {
          name: '工作记录',
          icon: 'form',
          value: 'GovDLWorkType2',
          path: 'interview'
        }
      ]
    },
    {
      name: '投诉情况',
      value: 'GovWorkType5',
      items: [
        {
          name: '工作记录',
          icon: 'form',
          value: 'GovDLWorkType2',
          path: 'complaint'
        }
      ]
    }, {
      name: '日常工作',
      value: 'GovWorkType0',
      items: [
        {
          name: '会议记录',
          icon: 'form',
          value: 'GovDLWorkType5',
          path: 'dailyWork'
        },
        {
          name: '工作记录',
          icon: 'form',
          value: 'GovDLWorkType2',
          path: 'dailyWork'
        },
        {
          name: '企业备忘录',
          icon: 'form',
          value: 'GovDLWorkType6',
          path: 'dailyWork'
        }
      ]
    },
  ];

  ngOnInit() {
    // if (window.location.pathname !== '/bj/hd/') {
    //   this.types.length = 3;
    // }
    this.activatedRouter.queryParams.subscribe((params: Params) => {
      if (params['companyName']) {
        this.companyName = params['companyName'];
      }
      if (params['companyId']) {
        this.companyId = params['companyId'];
      }
      if (params['checkType']) {
        this.checkType = params['checkType'];
        if (this.checkType === 'GovWorkType3') {
          this.types1 = this.types.slice(2, 3);
        } else if (this.checkType === 'GovWorkType2') {
          this.types1 = this.types.slice(1, 3);
        } else {
          this.types1 = this.types.slice(0, 3);
        }
      } else {
        this.types1 = this.types;
      }
    });
    this.userData = this.cache.get('userData');
  }


  exportTem() {
    this.net.exportFile().subscribe((res: Blob) => {
      console.log(res);
      this.save.saveExcel(res);
    });
  }

  upload(file, type) {
    this.net.FileUpload(file.target.files[0], type).subscribe((res: any) => {
      console.log(Object.prototype.toString.call(res).slice(8, -1));
      if (!res.code) {
        if (Object.prototype.toString.call(res).slice(8, -1) === 'Array' && res.length > 0) {
          this.moda.success({
            nzMask: false,
            nzTitle: '导入成功',
            nzContent: '以下企业信息导入失败:' + res.join(','),
          });
        } else {
          this.moda.success(
            {
              nzMask: false,
              nzTitle: '导入成功',
            }
          );
        }
      }
      console.log(res);
    });
  }

  triggerUpload(event) {
    return event.target.children[0] && event.target.children[0].click();
  }
}
