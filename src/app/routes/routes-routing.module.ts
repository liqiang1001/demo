import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { PassportComponent } from '../layout/passport/passport.component';
import { LoginComponent } from './passport/login/login.component';
import { DefaultComponent } from '../layout/default/default.component';
import { ForgotPasswardComponent } from './passport/forgot-passward/forgot-passward.component';
import { AuthenticationComponent } from './passport/authentication/authentication.component';
import { AuthGuard } from '../core/guard/auth-guard.service';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { CompanyComponent } from '../layout/company/company.component';
import { AppDashboardComponent } from './app/dashboard/dashboard.component';
import { HistoryComponent } from './app/dashboard/history/history.component';
const routes: Routes = [
  // 政府
  {
    path: 'main',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'govern', loadChildren: './main/govern/govern.module#GovernModule', canActivateChild: [AuthGuard] },
      { path: 'manager', loadChildren: './main/manager/manager.module#ManagerModule', canActivateChild: [AuthGuard] },
      { path: 'onsite', loadChildren: './main/onsite/onsite.module#OnsiteModule', canActivateChild: [AuthGuard] },
      { path: 'user', loadChildren: './main/user/user.module#UserModule', canActivateChild: [AuthGuard] },
      { path: 'reform', loadChildren: './main/reform/reform.module#ReformModule', canActivateChild: [AuthGuard] },
      { path: 'statistics', loadChildren: './main/statistics/statistics.module#StatisticsModule', canActivateChild: [AuthGuard] },
      { path: 'task-management', loadChildren: './main/task-management/task-mangement.module#TaskMangementModule',
      canActivateChild: [AuthGuard] },
      { path: 'risk', loadChildren: './main/risk/risk.module#RiskModule'},
      { path: 'workspace', loadChildren: './main/workspace/workspace.module#WorkspaceModule'},
      { path: 'complaint', loadChildren: './main/complaint/complaint.module#ComplaintModule' },
      { path: 'guest', loadChildren: './main/guest-registration/guset-registration.module#GusetRegistrationModule' },

      // 业务子模块
      // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' }
    ],
    data: {
      breadcrumb: '首页'
    }
  },
  // 企业
  {
    path: 'app',
    component: CompanyComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AppDashboardComponent },
      { path: 'dashboard', component: AppDashboardComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'user', loadChildren: './app/user/user.module#UserModule' },
      { path: 'complian', loadChildren: './app/complian/complian.module#ComplianModule'},
      { path: 'report', loadChildren: './app/report/report.module#ReportModule'},
    ],
    data: {
      breadcrumb: '首页'
    }
  },
  // passport
  {
    path: '',
    component: PassportComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: ForgotPasswardComponent },
      { path: 'register-result', component: AuthenticationComponent },
    ]
  },
  // // 单页不包裹Layout
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
