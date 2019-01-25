import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GovernComponent } from './govern.component';
import { OneCompanyOneFileComponent } from './one-company-one-file/one-company-one-file.component';
import { EditComponent } from './one-company-one-file/edit/edit.component';
import { DetailComponent } from './one-company-one-file/detail/detail.component';
import { WorkRecordComponent } from '../workspace/work-record/work-record.component';
import { WorkDetailComponent } from '../workspace/work-detail/work-detail.component';
import { WorkspaceComponent } from '../workspace/workspace/workspace.component';
import { ApproveManagementComponent } from './approve-management/approve-management.component';


const routes: Routes = [
  {
    path: '',
    component: GovernComponent,
    children: [
      {
        path: 'oneCompanyOneFile', component: OneCompanyOneFileComponent,
        data: {
          breadcrumb: '一企一档'
        },
        children: [
          {
            path: 'workspace', component: WorkspaceComponent
          },
          {
            path: 'workRecord', component: WorkRecordComponent, data: { breadcrumb: '行政核查' }
          },
          {
            path: 'workPlan', component: WorkRecordComponent, data: { breadcrumb: '良性退出' }
          },
          {
            path: 'launchplan', component: WorkRecordComponent, data: { breadcrumb: '风险处置' }
          },
          {
            path: 'workRecord/detail', component: WorkDetailComponent, data: { breadcrumb: '行政核查' }
          },
          {
            path: 'workPlan/detail', component: WorkDetailComponent, data: { breadcrumb: '良性退出' }
          },
          {
            path: 'launchplan/detail', component: WorkDetailComponent, data: { breadcrumb: '风险处置' }
          }
        ],
      },
      {
        path: 'oneCompanyOneFile/edit', component: EditComponent,
        data: {
          breadcrumb: '一企一档'
        }
      },
      {
        path: 'oneCompanyOneFile/detail', component: DetailComponent,
        data: {
          breadcrumb: '一企一档'
        }
      },
      {
        path: 'approveManagement', component: ApproveManagementComponent,
        data: {
          breadcrumb: '变更审批列表'
        }
      }
    ],
    data: {
      breadcrumb: '企业档案'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GovernRoutingModule { }
