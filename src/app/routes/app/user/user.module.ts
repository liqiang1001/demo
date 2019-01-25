import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserInfoComponent } from './user-info/user-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AvatarCropperComponent } from './avatar-cropper/avatar-cropper.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { UserComponent } from './user.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule,
        ImageCropperModule
    ],
    declarations: [UserComponent, UserInfoComponent, ChangePasswordComponent, AvatarCropperComponent],
    entryComponents: [
        AvatarCropperComponent,
    ]
})
export class UserModule { }
