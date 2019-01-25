import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DelonFormModule } from '@delon/form';
import { NgxEchartsModule } from 'ngx-echarts';
import { ObjTransformPipe } from '../core/pipe/obj-transform.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    DelonFormModule.forRoot()
  ],
  declarations: [ObjTransformPipe],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxEchartsModule,
    NgZorroAntdModule,
    DelonFormModule,
    ObjTransformPipe
  ]
})
export class SharedModule { }
