import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../../../core/cache/cache.service';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  formErrors = {
    loginName: '',
    orgIds: '',
    roleIds: '',
    registrationNumber: '',
    registrationAddress: '',
    enterpriseName: '',
    sourceId: '',
    systemIds: '',
    typeIds: '',
    provinceId: '',
    cityId: '',
    districtId: '',
    email: '',
    job: '',
    name: ''
  };
  validationMessages = {
    loginName: {
      required: '请输入用户名',
    },
    orgIds: {
      required: '请选择所属机构',
    },
    roleIds: {
      required: '请选择角色名称',
    },
    enterpriseName: {
      required: '请输入企业名称',
    },
    typeIds: {
      required: '请选择管理(企业)类型',
    },
    registrationNumber: {
      required: '请输入统一社会信用代码',
    },
    registrationAddress: {
      required: '注册地址不能为空',
    },
    sourceId: {
      required: '请选择来源',
    },
    systemIds: {
      required: '请选择可见系统',
    },
    provinceId: {
      required: '请选择省',
    },
    cityId: {
      required: '请选择市',
    },
    email: {
      required: '请输入邮箱',
    },
    districtId: {
      required: '请选择区',
    },
    job: {
      required: '请输入职位',
    },
    name: {
      required: '请输入姓名',
    },
  };
  constructor(private http: HttpClient, private cache: CacheService) { }
  // 政府模板地址
  downLoadGovTemp() {
    return this.http.get(environment.SERVER_URL + '/usermanagementservice/user/downloadGovExcel', { responseType: 'blob' });
  }
  // 企业模板地址
  downLoadEntTemp() {
    return this.http.get(environment.SERVER_URL + '/usermanagementservice/user/downloadEnterExcel', { responseType: 'blob' });
  }
  // 政府用户上传
  govFileUpload(file) {
    const formData = new FormData();
    formData.append('file', file.file);
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/user/importExcel', formData,
      { responseType: 'json', reportProgress: true });
  }
  // 企业用户上传
  entFileUpload(file) {
    const formData = new FormData();
    formData.append('file', file.file);
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/user/importEnterExcel', formData,
      { responseType: 'json', reportProgress: true });
  }
  // company 获取省级数据
  getProvincesData() {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findByRankNumAndPrentId',
      { 'parentId': '0', 'rankNum': '1', 'userId': this.cache.get('userId') });
  }
  // company 获取市级数据
  getCitys(areaId) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findByRankNumAndPrentId',
      { 'parentId': areaId, 'rankNum': '2', 'userId': this.cache.get('userId') });
  }
  // company 获取区级数据
  getDistricts(cityId) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findByRankNumAndPrentId',
      { 'parentId': cityId, 'rankNum': '3', 'userId': this.cache.get('userId') });
  }
  // company 获取街道级数据
  getRoads(districtId) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/areaManager/findByRankNumAndPrentId',
      { 'parentId': districtId, 'rankNum': '4', 'userId': this.cache.get('userId') });
  }
  // company 获取企业用户列表
  getCompanyList(params) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/enterpriseUser/findEnterpriseUserList',
      params);
  }
  // company 禁用/启用
  enable(id) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/user/used',
      { id: id });
  }
  // company 禁用/启用
  disable(id) {
    return this.http.post(environment.SERVER_URL + '/usermanagementservice/user/unused',
      { id: id });
  }
  // add   获取角色类型数据
  getRoleType(types) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/roleManager/findRoleListByType`, { 'types': types });
  }

  // 验证手机号是否已注册
  verifyMobile(mobile) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/verifyReMobile`,
      { 'mobile': mobile });
  }
  // 修改手机号
  restMobile(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/resetMobile`, params
    );
  }
  // 修改密码
  restPassWord(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/resetPassword`, params
    );
  }
  // 企业类型查询
  getenterType(userId) {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/dictManager/findUserTypeByUserId?userId=${userId}`);
  }
  // ==添加企业用户弹框
  // 获取角色名称  企业用户type ：1
  getRoleListByType(type, ids) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/roleManager/findRoleListByType`,
      { types: [type], ids: ids });
  }

  // 判断用户名是否存在
  verifyReLoginName(userName) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/verifyReLoginName`,
      { 'id': userName, 'loginName': userName });
  }
  // 添加用户操作
  addpriseUser(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/enterpriseUser/add`, params
    );
  }

  // ==修改企业用户弹框
  // 修改用户信息
  modifyPriseUser(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/enterpriseUser/edit`, params
    );
  }
  // 获取修改用户信息
  modifyPriseUserInfo(id) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/enterpriseUser/findEnterpriseUser`, { id: id }
    );
  }
  // govern 获取用户列表
  getGovernList(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/findUserList`,
      params);
  }
  // 机构查询
  getAgency() {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/sysOrgManager/findRoot`);
  }
  getAgencyTwo(id) {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/sysOrgManager/findByParentId?id=${id}`);
  }
  // 检测邮箱
  verifyReEmail(email) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/verifyReEmail`, { email: email });
  }
  // 添加用户操作
  addgovernUser(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/add`, params
    );
  }
  // 修改政府用户信息
  modifyGovernUser(params) {
    return this.http.post(environment.SERVER_URL + `/usermanagementservice/user/edit`, params
    );
  }
}
