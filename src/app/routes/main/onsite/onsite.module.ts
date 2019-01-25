import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnsiteRoutingModule } from './onsite-routing.module';
import { OnsiteComponent } from './onsite.component';
import { WorkAllotComponent } from './work-allot/work-allot.component';
import { CheckPlanComponent } from './check-plan/check-plan.component';
import { CheckResultComponent } from './check-result/check-result.component';
import { CheckGroupComponent } from './check-group/check-group.component';
import { CreateComponent } from './work-allot/create/create.component';
import { CheckRedultDetailComponent } from './check-result/check-redult-detail/check-redult-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { ClueSubmissionComponent } from './clue-submission/clue-submission.component';
import { ClueSubmissionDetailComponent } from './clue-submission/clue-submission-detail/clue-submission-detail.component';

@NgModule({
  imports: [
    CommonModule,
    OnsiteRoutingModule,
    SharedModule
  ],
  declarations: [
    OnsiteComponent,
    WorkAllotComponent,
    CheckPlanComponent,
    CheckResultComponent,
    CheckGroupComponent,
    CreateComponent,
    CheckRedultDetailComponent,
    ClueSubmissionComponent,
    ClueSubmissionDetailComponent]
})
export class OnsiteModule { }
