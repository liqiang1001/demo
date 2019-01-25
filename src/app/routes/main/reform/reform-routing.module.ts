import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReformComponent } from './reform.component';
import { ReformCheckComponent } from './reform-check/reform-check.component';
import { WorkallotCheckComponent } from './workallot-check/workallot-check.component';
import { DetailComponent } from './reform-check/detail/detail.component';
import { CreatWorkallotComponent } from './workallot-check/creat-workallot/creat-workallot.component';
import { WorkallotDetailComponent } from './workallot-check/workallot-detail/workallot-detail.component';

const reformCheckText = sessionStorage.getItem('74') ? '检查审核' : '合规检查审核';
const workallotCheckText = sessionStorage.getItem('74') ? '任务分配' : '检查任务分配';

const routes: Routes = [
  {
    path: '',
    component: ReformComponent,
    children: [
      {
        path: 'reformCheck', component: ReformCheckComponent, data: {
          breadcrumb: reformCheckText
        }
      },
      {
        path: 'reformCheck/detail', component: DetailComponent, data: {
          breadcrumb: reformCheckText
        }
      },
      {
        path: 'workallotCheck', component: WorkallotCheckComponent, data: {
          breadcrumb: workallotCheckText
        }
      },
      {
        path: 'workallotCheck/create', component: CreatWorkallotComponent, data: {
          breadcrumb: workallotCheckText
        },
      },
      {
        path: 'workallotCheck/detail', component: WorkallotDetailComponent, data: {
          breadcrumb: workallotCheckText
        },
      }
    ]
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReformRoutingModule { }
