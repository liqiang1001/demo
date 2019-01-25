import { Component, OnInit } from '@angular/core';
import { SFSchema, FormProperty, PropertyGroup, ErrorData } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd';
import { regex, error } from 'src/app/core/regex/regex';
import { CacheService } from '../../../../core/cache/cache.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.less']
})
export class UserInfoComponent implements OnInit {
  changeMobile: FormGroup;
  schema: SFSchema = {
    'properties': {
      'name': {
        'title': '用户名',
        'type': 'string'
      },
      'showname': {
        'title': '展示名',
        'type': 'string',
        'minLength': 3,
        'maxLength': 12
      },
      'mobile': {
        'title': '手机号',
        'type': 'string'
      },
      'job': {
        'title': '职位',
        'type': 'string'
      },
      'email': {
        'title': '邮箱',
        'type': 'string',
        ...regex.email
      },
      'role': {
        'title': '角色名称',
        'type': 'string',
      },
      'area': {
        'title': '管辖区域',
        'type': 'string',
      },
      'type': {
        'title': '管辖类型',
        'type': 'string',
      }
    },
    'required': ['showname', 'email']
  };
  // 表单默认数据
  formData: any = {};

  // 小组件ui类别
  ui = {
    $name: {
      widget: 'text'
    },
    $mobile: {
      widget: 'text'
    },
    $email: {
      errors: {
        ...error.email
      }
    },
    $job: {
      widget: 'text'
    },
    $role: {
      widget: 'text'
    },
    $showname: {
      errors: {
        'required': '必填项',
        'maxLength': '最大12位',
        'minLength': '最小3位'
      }
    },
    $area: {
      widget: 'text',
      autosize: { minRows: 2, maxRows: 6 }
    },
    $type: {
      widget: 'text',
      autosize: { minRows: 2, maxRows: 6 }
    }
  };
  layout = 'horizontal';
  isVisible = false;
  canGet = true;
  cutdown = 60;
  constructor(private msg: NzMessageService, private cache: CacheService, private fb: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    let area = this.cache.get('userData').provinceName + '-' + this.cache.get('userData').cityName;
    if (this.cache.get('userData').districtName) {
      area = this.cache.get('userData').provinceName + '-' + this.cache.get('userData').cityName + '-'
        + this.cache.get('userData').districtName;
      if (this.cache.get('userData').roadName) {
        area = this.cache.get('userData').provinceName + '-' + this.cache.get('userData').cityName + '-'
          + this.cache.get('userData').districtName + '-' + this.cache.get('userData').roadName;
      }
    }
    this.formData.name = this.cache.get('userData').loginName;
    this.formData.showname = this.cache.get('userData').name;
    this.formData.mobile = this.cache.get('userData').mobile;
    this.formData.job = this.cache.get('userData').roleNames;
    this.formData.email = this.cache.get('userData').email;
    this.formData.role = this.cache.get('userData').roleNames;
    this.formData.area = area;
    this.formData.type = this.cache.get('userData').typeNames;

    this.changeMobile = this.fb.group({
      id: this.cache.get('userData').id,
      pwd: null,
      mobile: { value: this.cache.get('userData').mobile, disabled: true },
      verificationCode: null
    });
  }
  submit(value: any) {
    this.msg.success(JSON.stringify(value));
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    // console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  getVerification() {
    const that = this;
    let timer;
    if (this.canGet) {
      this.canGet = false;
      this.userService.getVerifyCode(this.cache.get('userData').mobile).subscribe((res: any) => {
        // console.log(res);
        if (!res.code) {
          timer = window.setInterval(() => {
            if (that.cutdown > 0) {
              that.cutdown -= 1;
            } else {
              window.clearInterval(timer);
              that.cutdown = 60;
              that.canGet = true;
            }
          }, 1000);
        } else {
          this.canGet = true;
        }
      });
    }
  }
}
