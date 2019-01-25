import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { GovernRoutingModule } from './govern-routing.module';
import { GovernComponent } from './govern.component';
import { OneCompanyOneFileComponent } from './one-company-one-file/one-company-one-file.component';
import { SharedModule } from '../../../shared/shared.module';
import { EditComponent } from './one-company-one-file/edit/edit.component';
import { DetailComponent } from './one-company-one-file/detail/detail.component';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ApproveManagementComponent } from './approve-management/approve-management.component';


@NgModule({
  imports: [
    CommonModule,
    GovernRoutingModule,
    SharedModule,
    WorkspaceModule,
  ],
  declarations: [
    GovernComponent,
    OneCompanyOneFileComponent,
    EditComponent,
    DetailComponent,
    ApproveManagementComponent,
  ]
})
export class GovernModule { }
