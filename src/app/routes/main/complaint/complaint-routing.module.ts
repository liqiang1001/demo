import { NgModule } from '@angular/core';
import { ComplaintComponent } from './complaint.component';
import { RouterModule, Routes } from '@angular/router';
import { ComplaintPlatformComponent } from './complaint-platform/complaint-platform.component';
import { ComplaintDetailComponent } from './complaint-platform/complaint-detail/complaint-detail.component';
import { ComplaintDailyComponent } from './complaint-daily/complaint-daily.component';

const routes: Routes = [
  {
    path: '',
    component: ComplaintComponent,
    children: [
      {
        path: 'reformCheck', component: ComplaintPlatformComponent, data: {
          breadcrumb: '投诉平台'
        }
      },
      {
        path: 'reformCheck/detail', component: ComplaintDetailComponent, data: {
          breadcrumb: '投诉详情'
        }
      },
      {
        path: 'reformCheckDaily', component: ComplaintDailyComponent, data: {
          breadcrumb: '投诉日报'
        }
      }
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})



export class ComplaintRoutingModule { }

