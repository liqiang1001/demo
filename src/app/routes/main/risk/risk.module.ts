import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IllegalComponent } from './illegal/illegal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RiskRoutingModule } from './risk-routing.module';
import { RiskComponent } from './risk.component';
import { NormComponent } from './norm/norm.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RiskRoutingModule
  ],
  declarations: [ RiskComponent, IllegalComponent, NormComponent]
})
export class RiskModule { }
