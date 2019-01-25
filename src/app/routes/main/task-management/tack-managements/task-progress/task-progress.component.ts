import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from 'src/app/core/cache/cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TackMangementService } from '../../tack-mangement.service';
import { DictService } from 'src/app/core/dict/dict.service';
import { OnsiteService } from '../../../onsite/onsite.service';

@Component({
  selector: 'app-task-progress',
  templateUrl: './task-progress.component.html',
  styleUrls: ['./task-progress.component.less']
})
export class TaskProgressComponent implements OnInit {
  searchForm: FormGroup;
  searchParams = [];
  conpanyNameData: any;
  // 搜索表格
  allChecked = false;
  indeterminate = false;
  provinces: any;
  citys: any;
  districts: any;
  displayData = [];
  total: any;
  pageIndex = 1;
  pageSize = 10;
  data = [];
  id: any;
  checkList = [];
  isloading: boolean;
  reportProgressList: any;
  // 图表
  part;
  sumPie = 0;
  public showloading: boolean;
  chartOption;
  taskItemData: any;
  constructor(private fb: FormBuilder, private cache: CacheService,
    public router: Router,
    private areaHttp: OnsiteService,
    private activeRoute: ActivatedRoute,
    private message: NzMessageService,
    private http: TackMangementService, private dict: DictService) { }

  ngOnInit() {
    this.getProvince();
    this.taskItemData = this.cache.get('taskItemData');
    this.reportProgressList = this.dict.get('reportProgress');
    this.searchForm = this.fb.group({
      entName: [''],
      batchBeginDate: [''],
      provinceCode: [''],
      cityCode: [''],
      countyCode: [''],
      reportProgress: [''],
    });
    this.getSubMission(this.searchForm.value);
  }
  // 返回
  goBack() {
    history.go(-1);
  }
  drwCharts() {
    this.chartOption = {
      title: {
        text: `已报送${this.part}/共计${this.sumPie}`,
        left: 'center',
        top: 'bottom',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <br/>{c} ({d}%)',
      },
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        z: 2,
        style: {
          textAlingn: 'center'
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '80%'],
          avoidLabelOverlap: false,
          color: ['#0a7bb9', '#5bc0de'],
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '15',
              }
            }
          },
          data: [
            { value: this.total, name: `未报送${this.total}` },
            { value: this.part, name: `已报送${this.part}` },
          ]
        }
      ]
    };
  }

  // 获取省
  getProvince() {
    this.areaHttp.getProvincesData().subscribe(res => {
      this.provinces = res;
    });
  }
  // 获取市
  getCitys(e) {
    if (e) {
      this.areaHttp.getCitys(e).subscribe(res => {
        this.citys = res;
      });
    }
  }
  // 获取区
  getDistricts(e) {
    if (e) {
      this.areaHttp.getDistricts(e).subscribe(res => {
        this.districts = res;
      });
    }
  }
  getSubMission(params) {
    const list = {
      userId: this.cache.get('userId'),
      batchBeginDate: params.batchBeginDate,
      entName: params.entName,
      provinceId: params.provinceId,
      cityId: params.cityId,
      districtId: params.districtId,
      reportProgress: params.reportProgress,
    };
    this.http.getSubMission(list).subscribe((res: any) => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        if (res[i].name === '已报送') {
          this.part = res[i].value;
        } else {
          this.total = res[i].value;
        }
        this.sumPie += res[i].value;
      }
      this.drwCharts();
    });
  }

  getList(params) {
    const list = {
      userId: this.cache.get('userId'),
      taskIds: [this.taskItemData.id],
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      ...params,
    };
    this.http.getDetailsList(list).subscribe((res: any) => {
      console.log(res);
      // this.data = res.userList;
      this.total = res.pageTotal;
    });
  }
  // 分页
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus('');
  }
  // 刷新状态
  refreshStatus(e): void {
    if (e) {
      this.pageIndex = e;
      this.getList(this.searchForm.value);
    }
    for (const item of this.displayData.filter(value => value.status === '2')) {
      item.disabled = true;
    }
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    // for (const item of this.displayData.filter(value => value.checked)) {
    //   this.checkList.push(item.taskId);
    //   this.enterpriseIdList.push(item.id);
    // }
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }
  // 全选
  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus('');
  }

  // 导出
  export() {
    const list = {
      userId: this.cache.get('userId'),
      taskIds: [this.taskItemData.id],
    };
    this.http.export(list).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl);
    });
  }
  entInform(id) {
    const ids = [];
    if (!id) {
      this.message.error('请至少勾选一条数据执行通知!');
      return;
    } else {
      ids.push(id);
    }
    const list = {
      userId: this.cache.get('userId'),
      ids: ids
    };
    // if (id) {
    //   this.http.entInform(list).subscribe((res: any) => {
    //     this.getList(this.searchForm.value);
    //   });
    // }
  }
  // 重置搜索列表
  resetForm(): void {
    this.searchForm.reset();
  }

}
