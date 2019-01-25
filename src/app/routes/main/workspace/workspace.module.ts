import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceBoxComponent } from './workspace.component';
import { WorkRecordComponent } from './work-record/work-record.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkDetailComponent } from './work-detail/work-detail.component';
import { ManagerModule } from '../manager/manager.module';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { PetitionRecordComponent } from './petition-record/petition-record.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorkspaceRoutingModule,
    ManagerModule
  ],
  declarations: [WorkspaceBoxComponent,
    WorkspaceComponent, WorkRecordComponent, WorkDetailComponent, MemorandumComponent, PetitionRecordComponent],
  entryComponents: [
    MemorandumComponent,
    PetitionRecordComponent
  ]
})
export class WorkspaceModule { }
