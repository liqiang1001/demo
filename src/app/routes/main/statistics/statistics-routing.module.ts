import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsComponent } from './statistics.component';
import { ProgressOfRectificationComponent } from './progress-of-rectification/progress-of-rectification.component';
import { NetWorkLendingInfoComponent } from './net-work-lending-info/net-work-lending-info.component';
import { DayMessageSendInfoComponent } from './day-message-send-info/day-message-send-info.component';
import { MobilityMonitoredComponent } from './mobility-monitored/mobility-monitored.component';
import { ProgressDetailComponent } from './progress-of-rectification/progress-detail/progress-detail.component';
import { MobilityDetailComponent } from './mobility-monitored/mobility-detail/mobility-detail.component';



const routes: Routes = [
    {
        path: '',
        component: StatisticsComponent,
        children: [
            {
                path: 'progressOfRectification', component: ProgressOfRectificationComponent, data: {
                    breadcrumb: '整改明细'
                }
            },
            {
                path: 'progressOfRectification/detail',
                component: ProgressDetailComponent,
                data: {
                    breadcrumb: '整改明细'
                }
            },
            {
                path: 'mobilityMonitored', component: MobilityMonitoredComponent, data: {
                    breadcrumb: '流动缺口'
                }
            },
            {
                path: 'mobilityMonitored/detail',
                component: MobilityDetailComponent,
                data: {
                    breadcrumb: '流动缺口'
                }
            },
            {
                path: 'dayMessageSendInfo', component: DayMessageSendInfoComponent, data: {
                    breadcrumb: '日常信息'
                }
            },
            {
                path: 'netWorkLendingInfo', component: NetWorkLendingInfoComponent, data: {
                    breadcrumb: '经营信息'
                },
            },
        ],
        data: {
            breadcrumb: '网络借贷P2P'
        }
    }];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StatisticsRoutingModule { }
