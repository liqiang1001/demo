import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from 'src/app/core/cache/cache.service';
import { DictService } from 'src/app/core/dict/dict.service';
import { TackMangementService } from '../tack-mangement.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DefaultService } from 'src/app/layout/default/default.service';

@Component({
  selector: 'app-tack-managements',
  templateUrl: './tack-managements.component.html',
  styleUrls: ['./tack-managements.component.less']
})
export class TackManagementsComponent implements OnInit {

  searchForm: FormGroup;
  searchParams = [];
  // 搜索表格

  pageIndex = 1;
  pageSize = 10;
  displayData = [];
  isloading = false;
  total: any;
  isOnlyRead: any;
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
  menuList = [
    { id: 40, name: '创建填报任务', show: false },
    { id: 41, name: '详情', show: false },
    { id: 42, name: '关闭', show: false },
    { id: 134, name: '修改', show: false },
    { id: 135, name: '删除', show: false },
    { id: 43, name: '进度详情', show: false },
    { id: 133, name: '发布', show: false },

  ];
  reportTypeList: any;
  statusList: any;
  isDetail = false;
  tabList = ['序号', '任务名称', '任务开始时间', '创建人', '任务频次', '任务状态'];
  tableList: any;
  constructor(private nzMessageService: NzMessageService,
    private fb: FormBuilder, private cache: CacheService,
    public router: Router,
    private modalService: NzModalService,
    private activeRoute: ActivatedRoute,
    private menuHttp: DefaultService,
    private http: TackMangementService, private dict: DictService) { }
  ngOnInit() {
    this.getMenuAccess();
    this.statusList = this.dict.get('taskType');
    this.reportTypeList = this.dict.get('taskFrequency');
    this.isOnlyRead = this.cache.get('userInfo').isOnlyRead;
    this.searchForm = this.fb.group({
      name: [''],
      minDate: [''],
      maxDate: [''],
      reportType: [''],
      reportNumber: [''],
      status: [''],
    });
    this.getDataList(this.searchForm.value);
  }
  // 判断按钮权限
 getMenuAccess() {
  this.activeRoute.queryParams.subscribe((params: Params) => {
    console.log(params.littleId);
    this.menuHttp.getMenuAccess(params.littleId).subscribe((res: any) => {
      console.log(res);
      const list = [];
      if (res) {
        res.forEach(element => {
          list.push(element.id);
        });
        for (let i = 0; i < list.length; i++) {
          this.menuList.filter((item => {
            if (list.indexOf(item.id) > -1) {
              item.show = true;
            } else {
              item.show = false;
            }
          }));
        }
      }

    });
  });
}
  // 分页
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
  }
  refreshStatus(e) {
    if (e) {
      this.pageIndex = e;
      this.getDataList(this.searchForm.value);
    }
  }

  // 将时间转换为Date对象
  showtime(time) {
    if (time) {
      const month = time.getMonth() + 1;
      const timeData = time.getFullYear() + '-' + month + '-' + time.getDate();
      return timeData;
    } else {
      return '';
    }
  }

   // 将时间转换为Date对象
   changeTime(time) {
      const da = new Date(time);
      const year = da.getFullYear() + '年';
      const month = da.getMonth() + 1 + '月';
      const date = da.getDate() + '日';
      return [year, month, date].join('');
  }
  // 获取表格数据
  getDataList(params) {
    params.minDate = this.showtime(params.minDate);
    params.maxDate = this.showtime(params.maxDate);
    const list = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      userId: this.cache.get('userId'),
      ...params
    };
    this.isloading = true;
    this.http.getTable(list).subscribe((res: any) => {
      this.isloading = false;
      this.total = res.pageTotal;
      this.tableList = res.userList;
    });
  }
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }
  // 创建任务
  showModalForComponent(item) {
    if (item === 1) {
      this.router.navigate(['./createTask'], { relativeTo: this.activeRoute, queryParams: { type: item } });
    } else {
      this.router.navigate(['./createTask'], { relativeTo: this.activeRoute, queryParams: { type: 2 } });
      this.cache.set('TaskDetail', item);
    }
  }
  // 进度详情页
  taskProgress(item) {
    this.cache.set('taskItemData', item);
    this.router.navigate(['./taskProgress'], { relativeTo: this.activeRoute });
  }
  // 详情弹框
  getdetail(id) {
    this.isDetail = true;
    this.http.getTaskId(id).subscribe((res: any) => {
      if (res) {  // 预览页面
        if (res.name) {
          this.previewData.taskName = res.name;
        }
        if (res.taskFormList) {  // 选择子表单
          for (let i = 0; i < res.taskFormList.length; i++) {

            if (i === res.taskFormList.length - 1) {
              this.previewData.selectList += res.taskFormList[i].formName;
            } else {
              this.previewData.selectList += res.taskFormList[i].formName + '、';
            }
          }
        }
        if (res.dictList) {  // 企业类型
          const data = [];
          for (let i = 0; i < res.dictList.length; i++) {
            data.push(res.dictList[i].name);
          }
          this.previewData.conpanyType = data.join('，');
        }

        if (res.areaList) {  // 关联区域
          const data = [];
          for (let i = 0; i < res.areaList.length; i++) {
            data.push(res.areaList[i].fullName);
          }
          this.previewData.areas = data;
        }
        if (res.beginDate) { // 任务创建时间
          if (typeof res.beginDate !== 'object') {
            const dateTime = new Date(res.beginDate);
            this.previewData.taskTime = dateTime.getFullYear() + '年' + (dateTime.getMonth() + 1) + '月' + dateTime.getDate() + '日';
          } else {
            this.previewData.taskTime = res.beginDate.year + '年' + res.beginDate.month + '月' + res.beginDate.day + '日';
          }
        }
        // 是否紧急
        if (res.urgencyStatus === '0') {
          this.previewData.isEmergency = '是';
        } else {
          this.previewData.isEmergency = '否';
        }
        // 是否需要审批
        if (res.auditStatus === '0') {
          this.previewData.isApproval = '是';
        } else {
          this.previewData.isApproval = '否';
        }
        if (res.reportNumber) { // 填报频次
          this.previewData.status = res.reportNumber;
        }
        if (res.submitTimeComment) {  // 填报提交时间说明
          this.previewData.fillData = res.submitTimeComment;
        }
        if (res.attachment) {  // 附件
          this.previewData.accessory = JSON.parse(res.attachment);
        }
      }
    });
  }
  handleOk2() {
    this.isDetail = false;
  }
  handleCancel2() {
    this.isDetail = false;
  }
  download(item) {
    this.http.fileDownLoad(item.fileId, item.fileName);
  }

  toTaskName(e) {
    this.router.navigate(['./information'], { relativeTo: this.activeRoute, queryParams: { id: e.id } });
  }

  // 发布
  fabu(e) {
    const data = { id: e };
    const model = this.modalService.create({
      nzTitle: '确认发布',
      nzContent: '会以短信的形式发送给企业，请确认',
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => {
        this.http.issueTask(data).subscribe(res => {
          this.nzMessageService.success('任务发布成功');
          this.getDataList(this.searchForm.value);
        });
      }
    });
  }

  // 关闭
  close(e) {
    const data = {
      id: e.id,
      status: e.status
    };
    const model = this.modalService.create({
      nzTitle: '关闭任务',
      nzContent: '确认关闭任务？',
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => {
        this.http.closeTask(data).subscribe(res => {
          this.nzMessageService.success('任务关闭成功');
          this.getDataList(this.searchForm.value);
        });
      }
    });
  }
  // 删除
  removeTask(e) {
    const data = {
      id: e.id,
      status: e.status,
      userId: this.cache.get('userId')
    };
    const model = this.modalService.create({
      nzTitle: '删除任务',
      nzContent: '确认删除任务？删除后系统不存在该项任务',
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => {
        this.http.removeTask(data).subscribe(res => {
          this.nzMessageService.success('任务删除成功');
          this.getDataList(this.searchForm.value);
        });
      }
    });
  }
}

