import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppDashboardComponent } from './dashboard.component';
import { EntinfoComponent } from './entinfo/entinfo.component';
import { MsginfoComponent } from './msginfo/msginfo.component';
import { EnterinfoComponent } from './enterinfo/enterinfo.component';
import { TaskinfoComponent } from './taskinfo/taskinfo.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [AppDashboardComponent,
    EntinfoComponent, MsginfoComponent,
    EnterinfoComponent, TaskinfoComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AppDashboardModule { }
