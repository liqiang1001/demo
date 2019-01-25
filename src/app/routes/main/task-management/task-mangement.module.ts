import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagementComponent } from './task-management.component';
import { TackManagementsComponent } from './tack-managements/tack-managements.component';
import { TaskMangementRoutingModule } from './task-mangement-routing.module';
import { CreateTaskComponent } from './tack-managements/create-task/create-task.component';
import { InformationComponent } from './tack-managements/information/information.component';
import { TaskProgressComponent } from './tack-managements/task-progress/task-progress.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TaskMangementRoutingModule,
  ],
  declarations: [
    TaskManagementComponent,
    TackManagementsComponent,
    CreateTaskComponent,
    InformationComponent,
    TaskProgressComponent,
  ],
  entryComponents: [
    CreateTaskComponent,
  ]
})
export class TaskMangementModule { }
