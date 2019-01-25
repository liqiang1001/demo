import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceBoxComponent } from './workspace.component';
import { WorkRecordComponent } from './work-record/work-record.component';
import { WorkDetailComponent } from './work-detail/work-detail.component';
import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceBoxComponent,
    children: [
      {
        path: 'workspace', component: WorkspaceComponent
      },
      {
        path: 'workRecord', component: WorkRecordComponent, data: { breadcrumb: '整改' }
      },
      {
        path: 'workPlan', component: WorkRecordComponent, data: { breadcrumb: '退出' }
      },
      {
        path: 'launchplan', component: WorkRecordComponent, data: { breadcrumb: '风险处置' }
      },
      {
        path: 'interview', component: WorkRecordComponent, data: { breadcrumb: '企业约谈' }
      },
      {
        path: 'complaint', component: WorkRecordComponent, data: { breadcrumb: '投诉情况' }
      },
      {
        path: 'dailyWork', component: WorkRecordComponent, data: { breadcrumb: '日常工作' }
      },
      {
        path: 'workRecord/detail', component: WorkDetailComponent, data: { breadcrumb: '整改' }
      },
      {
        path: 'workPlan/detail', component: WorkDetailComponent, data: { breadcrumb: '退出' }
      },
      {
        path: 'launchplan/detail', component: WorkDetailComponent, data: { breadcrumb: '风险处置' }
      },
      {
        path: 'interview/detail', component: WorkDetailComponent, data: { breadcrumb: '企业约谈' }
      },
      {
        path: 'complaint/detail', component: WorkDetailComponent, data: { breadcrumb: '投诉情况' }
      },
      {
        path: 'dailyWork/detail', component: WorkDetailComponent, data: { breadcrumb: '日常工作' }
      }
    ],
    data: { breadcrumb: '工作台账' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
