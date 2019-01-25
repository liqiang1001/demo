import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import * as editor from 'editor';
import { WorkspaceService } from '../workspace.service';
import { CacheService } from 'src/app/core/cache/cache.service';
import { format } from 'date-fns';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService, NzIconService } from 'ng-zorro-antd';
import { DictService } from 'src/app/core/dict/dict.service';
import { AddCompanyUserComponent } from '../../manager/company-user-management/add-company-user/add-company-user.component';
import { MemorandumComponent } from '../memorandum/memorandum.component';
import { PetitionRecordComponent } from '../petition-record/petition-record.component';


@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.component.html',
  styleUrls: ['./work-detail.component.less']
})
export class WorkDetailComponent implements OnInit, OnDestroy {
  @ViewChild('ed') container;
  postForm: FormGroup;
  ed;
  uploadUrl = environment.SERVER_URL + '/upload-file/upload';
  downLoadUrl = environment.SERVER_URL + '/upload-file/download/';
  fileList = [];
  fileTempList = [];
  recordId;
  isRead;
  hasOtherType;
  inputValue: string;
  options = [];
  itemType;
  DLtype;
  formLabel: any;
  url = environment.SERVER_URL;
  formExample = {
    achievement: [null],  // 内容
    accessories: [null],  // 附件
    enterName: [null],    // 企业名称
    participator: [null],  // 参与人
    primaryParticipator: [null],  // 政府工作组
    secondaryParticipator: [null],  // 企业工作组
    recordDate: [null],   // 日期
    complainTypes: [null], // 投诉类型
    OtherType: [null], // 其他类型
    summary: [null],  // 主题
    workPlace: [null],  // 地点
    enterId: [null], // 企业id
    remark: [null],  // 备注
    progress: [null],  // 进度
    publicityStatus: 0,
    workComplains: this.fb.array([]) // 投诉人
  };
  // 字典
  roleOpts;
  focusOpts;
  RepresOtps;
  ProgressOpts;
  complainTypeOpts;
  list1: any;
  list2: any;
  companyId;
  companyName;
  time: any;
  enterHref: any;
  cutNum = 5;
  cutFlag = true;
  isSpinning: boolean;
  constructor(private fb: FormBuilder,
    public router: Router,
    private cache: CacheService,
    private http: WorkspaceService,
    private activeRoute: ActivatedRoute,
    private dict: DictService,
    private modalService: NzModalService,
    private msg: NzMessageService,
    private iconserve: NzIconService) { }

  // 投诉人
  complaList: FormGroup;

  // 获取投诉人表单组
  get workRecord() {
    return this.postForm.get('workComplains') as FormArray;
  }
  // 创建投诉人
  createComplaForm() {
    let form;
    if (this.DLtype === 'GovWorkType4') {
      form = {
        idNum: [''],
        job: [''],
        name: ['', Validators.required],
        phone: ['', Validators.required],
      };
    } else {
      form = {
        idNum: ['', Validators.required],
        address: ['', Validators.required],
        birthplace: [''],
        isFocus: [''],
        job: [''],
        isRepresentative: [''],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        role: ['', Validators.required],
        amount: ['', Validators.required],
        publicityStatus: 0,
        serialNumber: [''],
        idPhoto: [''],
        cameraPhoto: ['']
      };
    }
    // 投诉人字段、必填
    return this.fb.group(form);
  }
  // 新增投诉人
  addWorkRecord() {
    this.workRecord.push(this.createComplaForm());
  }
  // 删除投诉人
  removeItem(i) {
    this.workRecord.removeAt(i);
  }

  ngOnInit() {
    // 初始化表单
    this.postForm = this.fb.group(this.formExample);
    this.postForm.patchValue({
      recordDate: this.defaultDate(true)
    });
    // 添加默认投诉人
    this.addWorkRecord();
    // 获取路由参数
    this.activeRoute.params.subscribe((params) => {
      this.recordId = params.id;
      this.isRead = params.read;
      this.itemType = params.type;
      this.DLtype = params.dlType;
      // 有公司id  查询工作组
      if (params.companyId) {
        this.companyId = params.companyId;
        this.postForm.patchValue({ enterId: this.companyId });
        this.getWorkGroup(this.companyId);
      }
      if (params.companyName) {
        this.companyName = params.companyName;
        this.postForm.patchValue({ enterName: this.companyName });
      }
    });
    // 获取表单字段显示、必填配置
    this.getDetailconfig();
    // 查询记录详情
    if (this.recordId) {
      this.getDetail(this.recordId);
    }

    // 查询字典
    this.dict.get('source');
    this.dict.get('system_view');
    this.dict.get('userType');
    this.dict.get('WorkerType');
    this.iconserve.fetchFromIconfont({
      scriptUrl: '//at.alicdn.com/t/font_971791_52zfhvisd8p.js'
    });
    this.time = setInterval(() => {
      this.dict.get('BusinessBoolean');
      if (this.dict.get('AccountComplainType') && this.dict.get('ComplainRole')) {
        this.complainTypeOpts = this.dict.get('AccountComplainType').map(item => {
          return { label: item.name, value: item.id, checked: false };
        });
        this.roleOpts = this.dict.get('ComplainRole');
        this.focusOpts = this.dict.get('BusinessBoolean');
        clearInterval(this.time);
      }
    }, 100);

    if (this.DLtype === 'GovWorkType2') {
      this.ProgressOpts = this.dict.get('BenignExitProgress');
    } else {
      this.ProgressOpts = this.dict.get('RiskResponseProgress');
    }
  }
  getDict() {
    if (!this.focusOpts) {
      this.focusOpts = this.dict.get('BusinessBoolean');
    }
  }
  // 调用读卡器
  getReadCard(i) {
    this.http.readCrad().then(res => res.json()).then(res => {
      console.log(res.data);
      if (this.DLtype === 'GovWorkType4') {
        this.workRecord.at(i).patchValue({
          idNum: res.data.id_card_no,
          name: res.data.name
        });
      } else {
        this.http.reformUpload(this.http.getFileByBase64('data:image/jpeg;base64,' +
          res.data.photo, res.data.id_card_no + '.jpg')).subscribe((data: any) => {
            console.log(data);
            if (data.head.rspCode === '200') {
              this.workRecord.at(i).patchValue({
                idPhoto: '/upload-file/download/' + data.body
              });
            }
          });
        let time = res.data.period_of_validity;
        time = time.substring(time.length - 8);
        const time2 = format(new Date(), 'YYYYMMDD');
        // tslint:disable-next-line:radix
        if (parseInt(time) < parseInt(time2)) {
          this.msg.warning('身份证已过期');
        }
        this.workRecord.at(i).patchValue({
          idNum: res.data.id_card_no,
          name: res.data.name,
          birthplace: res.data.address,
          idPhoto: res.data.idPhoto
        });
        // this.modalService.confirm({
        //   nzTitle     : '确认?',
        //   nzContent   : '户籍所在地是否用居住地相同？',
        //   nzOkText    : '是',
        //   nzOkType    : 'primary',
        //   nzOnOk      : () => {
        //     this.workRecord.at(i).patchValue({
        //       address: res.data.address
        //     });
        //   },
        //   nzCancelText: '否',
        //   nzOnCancel  : () => {}
        // });
      }
    }).catch(err => {
      this.msg.warning('请重新放置身份证!');
    });
  }
  // 点击拍照
  getPhoto(i) {
    if (!this.cutFlag) {
      return this.msg.error('请等' + this.cutNum + 's后再次拍照');
    }
    this.isSpinning = true;
    this.http.takePhoto(this.cache.get('userId')).subscribe((res: any) => {
      console.log(res);
      if (!res.code) {
        this.workRecord.at(i).patchValue({
          cameraPhoto: res
        });
      }
      this.isSpinning = false;
    });
    this.cutNum = 5;
    const timer = setInterval(() => {
      this.cutNum -= 1;
      this.cutFlag = false;
      if (this.cutNum < 0) {
        this.cutFlag = true;
        this.cutNum = 0;
        clearInterval(timer);
      }
    }, 1000);
  }
  // 点击拍照
  takePhoto(i) {
    if (this.workRecord.at(i).value.cameraPhoto || this.workRecord.at(i).value.cameraPhoto.length > 0) {
      this.modalService.confirm({
        nzTitle: '确定要重新拍照吗？',
        nzContent: '',
        nzOnOk: () => this.getPhoto(i),
        nzOnCancel: () => {
          return;
        }
      });
    } else {
      this.getPhoto(i);
    }
  }
  equalAddr(i) {
    const val = this.workRecord.at(i).value.birthplace || this.workRecord.at(i).value.address;
    this.workRecord.at(i).patchValue({
      address: val,
      birthplace: val
    });
  }

  initEditer() {
    if (this.formLabel.achievement.visible === '1') {
      this.ed = new editor(this.container.nativeElement);
      this.ed.customConfig.fontNames = [
        '黑体',
        '仿宋',
        '楷体',
        '宋体',
        '微软雅黑',
        'Arial',
        'Tahoma',
        'Verdana'
      ];
      this.ed.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'image',  // 插入图片
        'table',  // 表格
        'undo',  // 撤销
        'redo'  // 重复
      ];
      this.ed.create();
    }
  }
  // 获取详情字段
  getDetailconfig() {
    this.http.getDetailConfig({
      recordType: this.DLtype,
      detailType: this.itemType
    }).subscribe(res => {
      const oDate = {};
      res[0].fieldConfigs.forEach(element => {
        oDate[element.name] = { visible: element.visible, desc: element.desc, necessity: element.necessity };
      });
      this.formLabel = oDate;
      setTimeout(() => {
        this.initEditer();
      }, 200);
    });
  }
  // 企业搜索建议
  onInput(value: string): void {
    this.http.getEntSuggest(value).subscribe((res: any) => {
      this.options = res;
    });
    if (!value) {
      this.enterHref = '';
      this.postForm.patchValue({
        enterName: '',
        enterId: '',
      });
    }

  }
  // 选择企业
  selectEnt(item) {
    this.postForm.patchValue({
      enterName: item.name,
      enterId: item.id,
    });
    this.enterHref = environment.BI_IP + '/bi?name=entinfo.frm&sign='
      + this.cache.get('token') + '&enterpriseId=' + item.id;
    this.getWorkGroup(item.id);
  }
  // 选择投诉类型
  selectCompainType(types) {
    if (types instanceof Array) {
      if (types.some(item => item === 'AccountComplainType17')) {
        this.hasOtherType = true;
      } else {
        this.hasOtherType = false;
        this.postForm.patchValue({
          OtherType: null
        });
      }
    }
  }
  // 查询工作组
  getWorkGroup(id) {
    const params: any = {};
    params.enterId = id;
    params.workType = this.DLtype;
    this.http.getWorkGroup({ groupType: 'WorkerType1', ...params }).subscribe((res: any) => {
      this.list1 = res;
      console.log(res);
    });
    this.http.getWorkGroup({ groupType: 'WorkerType3', ...params }).subscribe((res: any) => {
      this.list2 = res;
    });
  }
  // 上传附件
  upload(file) {
    let files = [];
    files = file.fileList.map(item => {
      if (item.response) {
        return {
          fileName: item.name,
          fileId: item.response.body,
          fileSize: item.size
        };
      } else if (item.name && item.url && item.size) {
        return {
          fileName: item.name,
          fileId: item.url.split('download/')[1],
          fileSize: item.size,
          id: item.id
        };
      } else {
        return null;
      }
    });
    this.fileTempList = files;
  }

  // 删除附件
  delFile = (file) => {
    this.fileList = this.fileList.filter(item => {
      if (file.id) {
        return item.id !== file.id;
      } else if (file.fileId) {
        return item.fileId !== file.fileId;
      } else {
        return item.uid !== file.uid;
      }

    });
  }

  // 根据id查询详情
  getDetail(id) {
    this.http.getRecordItem(id).subscribe((res: any) => {
      console.log(res);
      const oDate = new Date(res.recordDate);
      console.log(oDate);
      if (res.workComplains) {
        for (let i = 0; i < (res.workComplains.length - 1); i++) {
          this.addWorkRecord();
        }
        if (res.complainTypes) {
          const arr = res.complainTypes.split(',');
          if (arr.some(item => item === 'AccountComplainType17')) {
            res.OtherType = arr[arr.length - 1];
            arr.length = arr.length - 1;
            res.complainTypes = arr;
          } else {
            res.complainTypes = arr;
          }
        }
      }
      this.postForm.patchValue({
        ...res,
        recordDate: oDate
      });
      this.enterHref = environment.BI_IP + '/bi?name=entinfo.frm&sign='
        + this.cache.get('token') + '&enterpriseId=' + res.enterId;
      console.log(this.postForm.value);
      this.getWorkGroup(res.enterId);
      // // 参与人1 与 2
      // if (this.itemType === 'GovDLWorkType2') {
      //   this.postForm.patchValue({
      //     participator1: res.participator && res.participator.split('&')[0],
      //     participator2: res.participator && res.participator.split('&')[1]
      //   });
      // }
      this.fileList = res.accessories.map(item => {
        return {
          name: item.fileName,
          url: this.downLoadUrl + item.fileId,
          size: item.fileSize,
          id: item.id
        };
      });
      setTimeout(() => {
        if (this.formLabel.achievement.visible === '1') {
          this.ed.txt.html(res.achievement);
        }
        if (this.isRead === 'false') {
          this.postForm.disable({ onlySelf: this.isRead });
          if (this.formLabel.achievement.visible === '1') {
            this.ed.$textElem.attr('contenteditable', !this.isRead);
          }
        }
      }, 600);
    });
  }
  // 返回上一级
  goBack() {
    this.router.navigate(['../', { dlType: this.DLtype, type: this.itemType }], { relativeTo: this.activeRoute });
  }
  // 图片上传
  photoUp(i) {
    if (i) {
      // 上传文件服务
      this.http.reformUpload(this.http.urlToFile(i)).subscribe((data: any) => {
        console.log(data);
        // this.workRecord.at(i).patchValue({
        //   cameraPhoto: data
        // });
      });
    }
  }
  // 提交
  submit() {
    const params: any = {
      creatorId: this.cache.get('userId'),
      workRecord: {
        ...this.postForm.value
      }
    };
    console.log(params);
    // if (this.itemType === 'GovDLWorkType2') {
    //   params.workRecord.participator = this.postForm.value.participator1 ?
    //     (this.postForm.value.participator1 + '&' + this.postForm.value.participator2) : null;
    // }
    if (this.hasOtherType) {
      params.workRecord.complainTypes.push(params.workRecord.OtherType);
    }
    if (params.workRecord.complainTypes) {
      params.workRecord.complainTypes = params.workRecord.complainTypes.join(',');
    }
    params.workRecord.accessories = this.fileList.map(file => {
      if (file.response) {
        return {
          fileName: file.name,
          fileId: file.response.body,
          fileSize: file.size
        };

      } else {
        return file;
      }
    });
    if (this.formLabel.achievement.visible === '1') {
      params.workRecord.achievement = this.ed.txt.html() === '<p><br></p>' ? null : this.ed.txt.html();
    }

    params.workRecord.operatorId = this.cache.get('userId');
    params.workRecord.recordType = this.DLtype;
    params.workRecord.detailType = this.itemType;
    if (!this.requiredTest(params)) {
      this.msg.error('请输入必填项！');
      return;
    }
    if (this.DLtype === 'GovWorkType5') {
      const list = params.workRecord.workComplains;
      for (let i = 0; i < list.length; i++) {
        if (!list[i].name || !list[i].idNum ||
          !list[i].idNum || !list[i].phone ||
          !list[i].role || !list[i].address) {
          this.msg.error('请输入必填项！');
          return;
        }
      }
    }
    if (this.DLtype === 'GovWorkType4') {
      const list = params.workRecord.workComplains;
      for (let i = 0; i < list.length; i++) {
        if (!list[i].name || !list[i].job || !list[i].phone) {
          this.msg.error('请输入必填项！');
          return;
        }
      }
    }
    params.workRecord.recordDate = format(this.postForm.value.recordDate || new Date(), 'YYYY-MM-DD HH:mm:ss');
    if (this.postForm.value.enterName && !this.postForm.value.enterId) {
      this.msg.error('请选择系统中已有的企业');
      return;
    }
    console.log(params);
    this.http.createNewRecord(params).subscribe((res) => {
      this.msg.success('保存成功');
      this.goBack();
    });
  }

  // 修改
  change() {
    const params: any = {
      creatorId: this.cache.get('userId'),
      workRecord: {
        ...this.postForm.value
      }
    };
    // if (this.itemType === 'GovDLWorkType2') {
    //   params.workRecord.participator = this.postForm.value.participator1 + '&' + this.postForm.value.participator2;
    // }
    if (this.hasOtherType) {
      params.workRecord.complainTypes.push(params.workRecord.OtherType);
    }
    if (params.workRecord.complainTypes) {
      params.workRecord.complainTypes = params.workRecord.complainTypes.join(',');
    }
    params.workRecord.accessories = this.fileList.map(file => {
      if (file.response) {
        return {
          fileName: file.name,
          fileId: file.response.body,
          fileSize: file.size
        };

      } else {
        return file;
      }
    });
    if (this.formLabel.achievement.visible === '1') {
      params.workRecord.achievement = this.ed.txt.html() === '<p><br></p>' ? null : this.ed.txt.html();
    }
    params.workRecord.operatorId = this.cache.get('userId');
    params.workRecord.recordType = this.DLtype;
    params.workRecord.detailType = this.itemType;
    params.workRecord.id = this.recordId;
    if (!this.requiredTest(params)) {
      this.msg.error('请输入必填项！');
      return;
    }
    params.workRecord.recordDate = format(this.postForm.value.recordDate || new Date(), 'YYYY-MM-DD HH:mm:ss');
    if (this.postForm.value.enterName && !this.postForm.value.enterId) {
      this.msg.error('请选择系统中已有的企业');
      return;
    }
    this.http.updataRecordItem(params).subscribe((res) => {
      this.msg.success('修改成功');
      this.goBack();
    });
  }
  // 必填验证
  requiredTest(params) {
    const pass = true;
    console.log(params, this.formLabel);
    for (const key in this.formLabel) {
      // 验证配置项显示 && 必填
      if (this.formLabel[key].visible === '1' && this.formLabel[key].necessity === '1') {
        if (params.workRecord[key] === null) {
          return false;
        }
      }
    }
    return pass;
  }

  // 跳转添加企业
  addEnter() {
    let component;
    let title;
    component = AddCompanyUserComponent;
    title = '添加企业用户';
    const item = 1;
    const modal = this.modalService.create({
      nzWidth: 700,
      nzTitle: title,
      nzContent: component,
      nzFooter: null,
      nzComponentParams: {
        item: item,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        // this.getCompanyList({});
      }
    });

    // this.router.navigate(['/main/manager/companyUserManagement'], { relativeTo: this.activeRoute, queryParams: { add: true } });
  }
  defaultDate(i) {   // 设置默认时间数据
    const da = new Date();
    const year = da.getFullYear();
    const month = da.getMonth() + 1;
    const day = da.getDate();
    if (i) {
      return da;
    } else {
      return year + '-' + month + '-' + day;
    }
  }
  // 跳转企业档案
  toDetail() {
    if (!this.postForm.value.enterId) {
      this.msg.error('请输入企业名称');
      return;
    }
    // const id = this.postForm.value.enterId;
    // this.enterHref = environment.BI_IP + '/bi?name=entinfo.frm&sign='
    //   + this.cache.get('token') + '&enterpriseId=' + id;
  }
  enterInfo() {
    let component;
    let title;
    component = MemorandumComponent;
    title = '企业备忘录';
    const item = this.postForm.value.enterId;
    const modal = this.modalService.create({
      nzWidth: 850,
      nzTitle: title,
      nzContent: component,
      nzFooter: null,
      nzComponentParams: {
        item: item,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        // this.getCompanyList({});
      }
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.time);
  }
  // 上访记录弹框
  showModule() {
    let component;
    component = PetitionRecordComponent;
    const title = '待上诉访客';
    const modal = this.modalService.create({
      nzWidth: 850,
      nzTitle: title,
      nzContent: component,
      nzFooter: null,
      nzComponentParams: {
        item: 1,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getVisitorsDetail(result);
      }
    });
  }
  // 获取上访详情
  getVisitorsDetail(item) {
    this.http.getVisitorsDetail(item.serialNumber).subscribe((res: any) => {
      if (!res.code) {
        this.msg.success('查询成功');
        let list = [];
        if (res.complainList) {
          for (let i = 0; i < (res.complainList.length - 1); i++) {
            this.addWorkRecord();
          }
          list = res.complainList;
        }
        this.postForm.patchValue({
          enterName: res.enterName,
          enterId: res.enterId,
          workComplains: list,
        });
        if (res.enterId) {
          this.enterHref = environment.BI_IP + '/bi?name=entinfo.frm&sign='
            + this.cache.get('token') + '&enterpriseId=' + res.enterId;
        }
        console.log(this.postForm.value);
      }
    });
  }
}
