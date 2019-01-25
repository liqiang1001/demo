import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerComponent } from './manager.component';
import { GovernComponent } from '../govern/govern.component';
import { CompanyUserManagementComponent } from './company-user-management/company-user-management.component';
import { GovernUserManagementComponent } from './govern-user-management/govern-user-management.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    children: [
      {
        path: 'governUserManagement', component: GovernUserManagementComponent,
        data: {
          breadcrumb: '政府用户管理'
        }
      },
      { path: 'companyUserManagement', component: CompanyUserManagementComponent,
      data: {
        breadcrumb: '企业用户管理'
      }
     },
    ],
    data: {
      breadcrumb: '用户管理'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
