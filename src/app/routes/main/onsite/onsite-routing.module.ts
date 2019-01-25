import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnsiteComponent } from './onsite.component';
import { WorkAllotComponent } from './work-allot/work-allot.component';
import { CheckPlanComponent } from './check-plan/check-plan.component';
import { CheckResultComponent } from './check-result/check-result.component';
import { CheckGroupComponent } from './check-group/check-group.component';
import { CreateComponent } from './work-allot/create/create.component';
import { CheckRedultDetailComponent } from './check-result/check-redult-detail/check-redult-detail.component';
import { ClueSubmissionComponent } from './clue-submission/clue-submission.component';
import { ClueSubmissionDetailComponent } from './clue-submission/clue-submission-detail/clue-submission-detail.component';

const routes: Routes = [
  {
    path: '',
    component: OnsiteComponent,
    children: [
      { path: 'workAllot', component: WorkAllotComponent, data: { breadcrumb: '任务分配' } },
      { path: 'workAllot/Create', component: CreateComponent, data: { breadcrumb: '创建任务' } },
      { path: 'checkPlan', component: CheckPlanComponent, data: { breadcrumb: '核查进度' }  },
      { path: 'checkResult', component: CheckResultComponent, data: { breadcrumb: '核查结果' }  },
      { path: 'checkResult/Detail', component: CheckRedultDetailComponent, data: { breadcrumb: '核查结果' } },
      { path: 'checkGroup', component: CheckGroupComponent, data: { breadcrumb: '核查项组' }  },
      { path: 'clueSubmission', component: ClueSubmissionComponent, data: { breadcrumb: '线索报送' } },
      { path: 'clueSubmission/Detail/:id', component: ClueSubmissionDetailComponent, data: { breadcrumb: '线索报送' } },
    ],
    data: {
      breadcrumb: '现场检查任务管理'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnsiteRoutingModule { }
