import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComplaintComponent } from './complaint.component';
import { ComplaintPlatformComponent } from './complaint-platform/complaint-platform.component';
import { ComplaintRoutingModule } from './complaint-routing.module';
import { ComplaintDetailComponent } from './complaint-platform/complaint-detail/complaint-detail.component';
import { ComplaintDailyComponent } from './complaint-daily/complaint-daily.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ComplaintRoutingModule
  ],
  declarations: [ComplaintComponent, ComplaintPlatformComponent, ComplaintDetailComponent, ComplaintDailyComponent]
})
export class ComplaintModule { }
