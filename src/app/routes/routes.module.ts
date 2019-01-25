import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteRoutingModule } from './routes-routing.module';

// 单页面
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { LoginComponent } from './passport/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { PassportModule } from './passport/passport.module';
import { WaterballComponent } from './main/dashboard/waterball/waterball.component';
import { DashboardModule } from './main/dashboard/dashboard.module';
import { AppDashboardModule } from './app/dashboard/dashboard.module';

const COMPONENTS = [
  Exception403Component,
  Exception404Component,
  Exception500Component,
  LoginComponent,
  WaterballComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouteRoutingModule,
    SharedModule,
    PassportModule,
    DashboardModule,
    AppDashboardModule
  ],
  declarations: [
    ...COMPONENTS,
  ]
})
export class RoutesModule { }
