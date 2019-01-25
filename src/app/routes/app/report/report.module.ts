import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormItemComponent } from './form/form-item/form-item.component';
import { UploadComponent } from './shared/upload/upload.component';

@NgModule({
  declarations: [ReportComponent, FormComponent, FormItemComponent, UploadComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule
  ],
  // exports: [UploadComponent],
  entryComponents: [UploadComponent]
})
export class ReportModule { }
