import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgressComponent } from './progress/progress.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: 'progress', component: ProgressComponent
  },
  {
    path: 'report', component: ReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplianRoutingModule { }
