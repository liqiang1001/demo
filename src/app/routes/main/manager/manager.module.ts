import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { GovernUserManagementComponent } from './govern-user-management/govern-user-management.component';
import { CompanyUserManagementComponent } from './company-user-management/company-user-management.component';
import { SharedModule } from '../../../shared/shared.module';
import { AddCompanyUserComponent } from './company-user-management/add-company-user/add-company-user.component';
import { EditCompanyUserComponent } from './company-user-management/edit-company-user/edit-company-user.component';
import { EditGovernUserComponent } from './govern-user-management/edit-govern-user/edit-govern-user.component';
import { AddGovernUserComponent } from './govern-user-management/add-govern-user/add-govern-user.component';
import { ResetModalComponent } from './company-user-management/reset-modal/reset-modal.component';


@NgModule({
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule
  ],
  declarations: [
    ManagerComponent,
    GovernUserManagementComponent,
    CompanyUserManagementComponent,
    AddCompanyUserComponent,
    EditCompanyUserComponent,
    AddGovernUserComponent,
    EditGovernUserComponent,
    ResetModalComponent
  ],
  entryComponents: [
    AddCompanyUserComponent,
    EditCompanyUserComponent,
    AddGovernUserComponent,
    EditGovernUserComponent,
    ResetModalComponent
  ]
})
export class ManagerModule { }
