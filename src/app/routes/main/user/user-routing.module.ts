import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
   {
  path: '',
  component: UserComponent,
  children: [
    { path: 'userInfo', component: UserInfoComponent, data: {
      breadcrumb: '个人中心'
    } },
    { path: 'changePassword', component: ChangePasswordComponent , data: {
      breadcrumb: '修改密码'
    }}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
