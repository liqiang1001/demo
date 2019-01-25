import { Component, OnInit } from '@angular/core';
import { DictService } from '../../../../../core/dict/dict.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CacheService } from '../../../../../core/cache/cache.service';
import { GovernService } from '../../govern.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  // 编辑表格
  editForm: FormGroup;
  records: any;
  // 字典
  FbusinessSituation: any;
  FworkProgress: any;
  FclassificationDisposal: any;
  FrectificationStatus: any;
  Fbatch: any;
  FpaydayLoan: any;
  FselfHireProfessional: any;
  // 检查状态
  workType: any;
  companyId: any;
  checkType: any;

  constructor(public router: Router, private fb: FormBuilder, private _CacheService: CacheService, private _GovernService: GovernService,
    private dict: DictService, private message: NzMessageService, private activatedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe((params: Params) => {
      this.companyId = params['companyId'];
      this.checkType = params['checkType'];
      console.log(this.checkType);
    });

    this.workType = this.dict.get('GovWorkType').slice(0, 3);
    // 字典获取
    this.FbusinessSituation = this.dict.get('operating_status');  // 经营状态
    this.FworkProgress = this.dict.get('work_progress');  // 工作进展
    this.FclassificationDisposal = this.dict.get('classification');  // 分类处置
    this.FrectificationStatus = this.dict.get('rectification_status');  // 整改状态
    this.Fbatch = this.dict.get('enterprise_batch');  // 通知书批次
    this.FpaydayLoan = this.dict.get('yes_or_no');  // 现金贷业务
    this.FselfHireProfessional = this.dict.get('yes_or_no');  // 自行聘请专业机构
    this.editForm = this.fb.group({
      number: '',  // 编号
      paydayLoan: '', // 现金贷业务
      batch: [''], // 通知书批次
      workProgress: [''], // 工作进展
      businessSituation: [''], // 经营状态
      rectificationStatus: [''], // 整改状态
      selfHireProfessional: [''], // 自行聘请专业机构
      classificationDisposal: [], // 分类处置
      checkType: [''],
    });
    this._getMsg();
  }

  _getMsg() {
    this._GovernService.getMsg(this.companyId).subscribe(res => {
      console.log(res);
      this.records = res.changeInfoList;
      this.editForm.patchValue({
        number: res.enterprise.number,
        businessSituation: res.enterprise.businessSituation,
        paydayLoan: res.enterprise.paydayLoan,
        batch: res.enterprise.batch,
        workProgress: res.enterprise.workProgress,
        rectificationStatus: res.enterprise.rectificationStatus,
        selfHireProfessional: res.enterprise.selfHireProfessional,
        classificationDisposal: res.enterprise.classificationDisposal,
        checkType: res.enterprise.checkType
      });
      if (this.editForm.value.checkType === 'GovWorkType3') {
        this.workType = this.workType.slice(2, 3);
      } else if (this.editForm.value.checkType === 'GovWorkType2') {
        this.workType = this.workType.slice(1, 3);
      }
    });
  }

  // 保存
  _save(params) {
    console.log(params);
    const datas = {
      id: this.companyId,
      userId: this._CacheService.get('userData').id,
      ...params
    };
    this._GovernService.save(datas).subscribe(res => {
      // console.log( res );
      this.message.success('修改保存成功');
      this._getMsg();
      this.goBack();
    });
  }

  // 返回
  goBack() {
    history.go(-1);
  }
}
