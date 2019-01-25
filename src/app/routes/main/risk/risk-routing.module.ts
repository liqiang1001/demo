import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RiskComponent } from './risk.component';
import { IllegalComponent } from './illegal/illegal.component';
import { NormComponent } from './norm/norm.component';

const routes: Routes = [
  {
    path: '',
    component: RiskComponent,
    children: [
      {
        path: 'illegal', component: IllegalComponent, data: {
          breadcrumb: '非法集资'
        }
      }, {
        path: 'norm', component: NormComponent, data: {
          breadcrumb: '风险预警'
        }
      },
    ]
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskRoutingModule { }
