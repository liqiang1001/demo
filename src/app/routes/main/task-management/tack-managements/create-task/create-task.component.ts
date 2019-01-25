import { Component, OnInit, ViewChild } from '@angular/core';
import { CacheService } from 'src/app/core/cache/cache.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TackMangementService } from '../../tack-mangement.service';
import { DictService } from 'src/app/core/dict/dict.service';
import { StatisticsService } from '../../../statistics/statistics.service';
import { OnsiteService } from '../../../onsite/onsite.service';
import { ReformService } from '../../../reform/reform.service';
import { NzModalService, NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions, NzMessageService } from 'ng-zorro-antd';
import { format } from 'util';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.less']
})
export class CreateTaskComponent implements OnInit {
  @ViewChild('treeCom') treeCom;
  nodes: NzTreeNodeOptions[];
  createForm: FormGroup;
  createParams = [];
  reportTypeList = [];
  reportTypelist2 = [];
  conpanyNameData: any;
  TypeList = [];
  // statusTwo = '';
  progress = 0;
  confirmd = false;
  isVisible = false;
  filenamed = [];
  filenamed1 = [];
  filenamed1s = [];
  isDetail = false;
  previewData = {
    taskName: '',  // 任务名称
    selectList: '',  // 表单列表
    conpanyType: '',  // 公司类型
    areas: [],   // 关联区域
    taskTime: '',  // 任务时间
    isEmergency: '',  // 是否紧急
    isApproval: '',  // 是否需要审批
    status: '',   // 频次
    fillData: '',  // 填报时间说明
    accessory: []  // 附件
  };
  TaskDetail: any;
  areasList: any;
  districtIds: any;
  fileId: any;
  constructor(
    private fb: FormBuilder, private cache: CacheService,
    public router: Router,
    private httpType: StatisticsService,
    private message: NzMessageService,
    private updataHttp: ReformService,
    private activeRoute: ActivatedRoute,
    private areaHttp: OnsiteService,
    private http: TackMangementService, private dict: DictService) { }

  ngOnInit() {
    this.reportTypelist2 = this.dict.get('taskFrequency');
    this.reportTypeList = this.reportTypelist2.slice(0, this.reportTypelist2.length - 1);
    this.httpType.getRoleType().subscribe(res => {
      this.conpanyNameData = res;
    });
    this.createForm = this.fb.group({
      taskName: [''],
      conpanyType: [],
      areas: [''],
      taskTime: [''],
      isEmergency: 0,
      isApproval: 0,
      statusOne: [''],
      statusTwo: [''],
      fillData: [''],
      selectList: [],
    });
    this.activeRoute.queryParams.subscribe((params) => {
      if (params.type === '1') {
        this.confirmd = false;
      } else {
        this.confirmd = true;
        if (this.confirmd) {
          this.getTaskId(this.cache.get('TaskDetail').id);
        }
      }
    });
  }
  nzCheck(event: NzFormatEmitEvent): void {
    const arr = this.treeCom.getCheckedNodeList();
    const brr = [];
    const c = [];
    arr.filter(item => {
      if (item.children.length > 0) {
        item.children.filter(i => {
          if (i.children.length > 0) {
            i.children.filter(j => {
              brr.push(j.origin.fullName);
              c.push(j.key);
            });
          } else if (i.children.length === 0) {
            brr.push(i.origin.fullName);
            c.push(i.key);
          }
        });
      } else if (item.children.length === 0) {
        brr.push(item.origin.fullName);
        c.push(item.key);
      }
    });
    this.areasList = brr;
    this.districtIds = c;
  }
  selectType(e) {
    if (!this.districtIds) {
      this.districtIds = [];
    }
    this.getTypeList(this.districtIds, e);
  }
  getTypeList(a, b) {
    const list = {
      districtIds: a,
      taskEnterpriseType: b
    };
    this.http.getAreaAndType(list).subscribe((res: any) => {
      this.TypeList = res;
      if (this.TaskDetail) {
        for (const i of this.TaskDetail.taskFormList) {
          for (const items of this.TypeList.filter(ele => ele.id === i.id)) {
            items.checked = true;
          }
        }
      }
    });
  }
  selectRadio(e) {
    if (e && e !== this.reportTypelist2[this.reportTypelist2.length - 1].id) {
      this.createForm.patchValue({ statusTwo: '' });
    }
  }
  focus() {
    this.createForm.patchValue({
      statusOne: this.reportTypelist2[this.reportTypelist2.length - 1].id,
    });
  }

  // 获取区列表
  getTree() {
    this.isVisible = true;
    let params = {};
    if (this.confirmd) {
      const list = {
        id: this.cache.get('userId'),
        taskId: this.cache.get('TaskDetail').id
      };
      params = list;
    } else {
      const list = {
        id: this.cache.get('userId'),
      };
      params = list;
    }
    this.http.getTree(params).subscribe((res: any) => {
      if (res.length > 0) {
        const b = [];
        const c = [];
        const a = [];
        res.filter((item: any) => {
          item.children.filter((i: any) => {
            const arr2 = {
              title: i.name,
              key: i.id,
              children: c,
              fullName: i.fullName,
              fullId: i.fullId,
            };
            b.push(arr2);
            i.children.filter((j: any) => {
              const arr3 = {
                title: j.name,
                key: j.id,
                fullName: j.fullName,
                fullId: j.fullId,
              };
              c.push(arr3);
            });
            if (this.districtIds) {
              for (const aa of this.districtIds) {
                for (const items of c.filter(ele => ele.key === aa)) {
                  items.checked = true;
                }
              }
            }
          });
          const arr = {
            title: item.name,
            key: item.id,
            children: b,
            fullName: item.fullName,
            fullId: item.fullId
          };
          a.push(arr);
        });
        this.nodes = a;
      }
      // this.nodes.push();
    });
  }
  handleOk() {
    this.isVisible = false;
    if (this.createForm.value.conpanyType !== null) {
      if (!this.districtIds) {
        this.districtIds = [];
      }
      this.getTypeList(this.districtIds, this.createForm.value.conpanyType);
    } else if (this.districtIds) {
      this.getTypeList(this.districtIds, []);
    }
    if (this.areasList) {
      this.createForm.patchValue({ areas: this.areasList.join(',   ') });
    }
  }
  handleCancel() {
    this.isVisible = false;
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  getprogress = (p) => {
    this.progress = p.toFixed(0);
    if (p === 100) {
      this.filenamed1 = this.filenamed1s;
    }
  }
  getfileids = (id) => {
    if (id) {
      this.fileId = id;
      for (let i = 0; i < this.filenamed1s.length; i++) {
        this.filenamed1s[this.filenamed1s.length - 1].fileId = id;
      }
    }
  }
  click_fileUp = (item) => {
    this.http.reformFileUpload(item, this.cache.get('userId'), null, this.getprogress, this.getfileids);
    const arr = {
      fileName: item.file.name,
      fileId: this.fileId
    };
    this.filenamed1s.push(arr);
  }
  // 获取详情页信息
  getTaskId(id) {
    this.http.getTaskId(id).subscribe((res: any) => {
      const conpanyType = [];
      res.dictList.filter(item => {
        conpanyType.push(item.id);
      });
      const areas = [];
      const ids = [];
      res.areaList.filter(item => {
        areas.push(item.fullName);
        ids.push(item.id);
      });
      this.districtIds = ids;
      this.getTypeList(this.districtIds, conpanyType);
      const formList = [];
      for (const item of res.taskFormList) {
        formList.push(item.id);
      }
      this.TaskDetail = res;
      this.createForm.patchValue({
        taskName: res.name,
        conpanyType: conpanyType,
        areas: areas.join(',   '),
        taskTime: this.timesZh(res.createDate),
        isEmergency: res.urgencyStatus,
        isApproval: res.auditStatus,
        statusTwo: res.reportNumber,
        statusOne: res.reportType,
        fillData: res.submitTimeComment,
        selectList: formList
      });
      if (res.attachment !== '') {
        this.filenamed = JSON.parse(res.attachment);
      }
    });
  }
  // 时间处理
  timesZh(time) {
    const date = new Date(time);
    return date;
  }
  creatTask(params) {
    const that = this;
    if (!this.districtIds) {
      this.districtIds = '';
    }
    let attach;
    if (this.confirmd) {
      attach = this.filenamed1.concat(this.filenamed);
    } else {
      attach = this.filenamed1;
    }
    if (!params.taskName) {
      this.message.error('请填写任务名称！');
      return;
    }
    if (!params.selectList) {
      this.message.error('请选择任务表单');
      return;
    }
    if (!params.conpanyType) {
      this.message.error('请填写企业类型！');
      return;
    }
    if (!params.areas) {
      this.message.error('请填写关联区域！');
      return;
    }
    if (!params.taskTime) {
      this.message.error('请选择任务开始日期！');
      return;
    }
    if (!params.statusOne) {
      this.message.error('请选择频次！');
      return;
    }
    const list = {
      name: params.taskName,
      formList: params.selectList,
      districtIds: this.districtIds,
      createBy: this.cache.get('userId'),
      userId: this.cache.get('userId'),
      reportNumber: params.statusTwo,
      reportType: params.statusOne,
      submitTimeComment: params.fillData,
      attachment: attach.length > 0 ? JSON.stringify(attach) : '',
      taskEnterpriseType: params.conpanyType,
      urgencyStatus: params.isEmergency,
      auditStatus: params.isApproval,
      beginDate: params.taskTime,
    };
    if (this.confirmd) {
      const lists = {
        ...list,
        id: that.TaskDetail.id
      };
      that.http.editTask(lists).subscribe(res => {
        that.router.navigate(['/main/task-management/taskManagement']);
        that.message.success('任务修改成功');
      });
    } else {
      that.http.creatTask(list).subscribe((res: any) => {
        if (res === null) {
          that.router.navigate(['/main/task-management/taskManagement']);
          that.message.success('创建成功');
        }
      });
    }
  }
  selectCheckOpiton(e) {
    this.createForm.patchValue({ selectList: e });
  }
  // 预览弹框
  // getdetail() {
  //   if (this.createForm.value.selectList || this.createForm.value.conpanyType || this.createForm.value.areas) {
  //     this.isDetail = true;
  //     this.previewData.taskName = this.createForm.value.taskName;
  //     const res = this.createForm.value;
  //     if (res.taskName) {
  //       this.previewData.taskName = this.createForm.value.taskName;
  //     }
  //     if (res.selectList) {  // 选择子表单
  //       for (let i = 0; i < this.TypeList.length; i++) {
  //         if (i === this.TypeList.length - 1) {
  //           this.previewData.selectList += this.TypeList[i].formName;
  //         } else {
  //           this.previewData.selectList += this.TypeList[i].formName + '、';
  //         }
  //       }
  //     }
  //     if (res.conpanyType) {  // 企业类型
  //       const data = [];
  //       for (let i = 0; i < this.conpanyNameData.length; i++) {
  //         data.push(this.conpanyNameData[i].name);
  //       }
  //       this.previewData.conpanyType = data.join('，');
  //     }
  //     if (res.areas) {  // 关联区域
  //       this.previewData.areas = res.areas;
  //     }
  //     if (res.taskTime) { // 任务创建时间
  //       if (typeof res.taskTime !== 'object') {
  //         const dateTime = new Date(res.taskTime);
  //         this.previewData.taskTime = dateTime.getFullYear() + '年' + (dateTime.getMonth() + 1) + '月' + dateTime.getDate() + '日';
  //       } else {
  //         this.previewData.taskTime = res.taskTime.year + '年' + res.taskTime.month + '月' + res.taskTime.day + '日';
  //       }
  //     }
  //     // 是否紧急
  //     if (res.urgencyStatus === '0') {
  //       this.previewData.isEmergency = '是';
  //     } else {
  //       this.previewData.isEmergency = '否';
  //     }
  //     // 是否需要审批
  //     if (res.auditStatus === '0') {
  //       this.previewData.isApproval = '是';
  //     } else {
  //       this.previewData.isApproval = '否';
  //     }
  //     if (res.statusOne) { // 填报频次
  //       if (res.statusOne === '1008') {
  //         this.previewData.status = '间隔' + this.statusTwo + '天';
  //       } else {
  //         for (const items of this.reportTypeList.filter(ele => ele.id === res.statusOne)) {
  //           this.previewData.status = items.name;
  //         }
  //       }
  //     }
  //     if (res.submitTimeComment) {  // 填报提交时间说明
  //       this.previewData.fillData = res.submitTimeComment;
  //     }
  //     if (this.confirmd) {
  //       console.log(this.filenamed);
  //       this.previewData.accessory = this.filenamed1.concat(this.filenamed);
  //     } else {
  //       this.previewData.accessory = this.filenamed1;
  //     }
  //   } else {
  //     return;
  //   }
  // }
  // handleOk2() {
  //   this.isDetail = false;
  // }
  // handleCancel2() {
  //   this.isDetail = false;
  // }

}
