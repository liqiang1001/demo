import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplianRoutingModule } from './complian-routing.module';
import { ProgressComponent } from './progress/progress.component';
import { ReportComponent } from './report/report.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ProgressComponent, ReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    ComplianRoutingModule
  ]
})
export class ComplianModule { }
