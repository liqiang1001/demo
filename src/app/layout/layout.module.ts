;
import { LoginHeaderComponent } from './passport/login-header/login-header.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PassportComponent } from './passport/passport.component';
import { DefaultComponent } from './default/default.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { LoginFootComponent } from './passport/login-foot/login-foot.component';
import { CompanyComponent } from './company/company.component';
import { Header2Component } from './company/header/header.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    PassportComponent,
    DefaultComponent,
    HeaderComponent,
    Header2Component,
    SidebarComponent,
    LoginHeaderComponent,
    LoginFootComponent,
    CompanyComponent,
    ]
})
export class LayoutModule { }
