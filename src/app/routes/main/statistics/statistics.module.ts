import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { NetWorkLendingInfoComponent } from './net-work-lending-info/net-work-lending-info.component';
import { DayMessageSendInfoComponent } from './day-message-send-info/day-message-send-info.component';
import { MobilityMonitoredComponent } from './mobility-monitored/mobility-monitored.component';
import { ProgressOfRectificationComponent } from './progress-of-rectification/progress-of-rectification.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { ProgressDetailComponent } from './progress-of-rectification/progress-detail/progress-detail.component';
import { MobilityDetailComponent } from './mobility-monitored/mobility-detail/mobility-detail.component';

@NgModule({
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    SharedModule
  ],
  declarations: [StatisticsComponent, NetWorkLendingInfoComponent,
     DayMessageSendInfoComponent, MobilityMonitoredComponent,
     ProgressOfRectificationComponent, ProgressDetailComponent, MobilityDetailComponent]
})
export class StatisticsModule { }
