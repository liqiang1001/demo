import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { GuestRegistrationRoutingModule } from './guest-registration-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GuestRegistrationComponent } from './guest-registration.component';

@NgModule({
  declarations: [GuestRegistrationComponent, RegistrationComponent],
  imports: [
    CommonModule,
    SharedModule,
    GuestRegistrationRoutingModule,

  ]
})
export class GusetRegistrationModule { }
