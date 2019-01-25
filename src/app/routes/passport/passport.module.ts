import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPasswardComponent } from './forgot-passward/forgot-passward.component';
import { AuthenticationComponent } from './authentication/authentication.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ForgotPasswardComponent, AuthenticationComponent]
})
export class PassportModule { }
