import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GuestRegistrationComponent } from './guest-registration.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {
    path: '',
    component: GuestRegistrationComponent,
    children: [
      {
        path: 'registration', component: RegistrationComponent, data: { breadcrumb: '访客登记' }
      },
    ],
    data: { breadcrumb: '访客登记' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRegistrationRoutingModule { }
