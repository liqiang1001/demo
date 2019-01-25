import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReformComponent } from './reform.component';
import { ReformCheckComponent } from './reform-check/reform-check.component';
import { WorkallotCheckComponent } from './workallot-check/workallot-check.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReformRoutingModule } from './reform-routing.module';
import { DetailComponent } from './reform-check/detail/detail.component';
import { FileViewComponent } from './shared/file-view/file-view.component';
import { FileUploadComponent } from './shared/file-upload/file-upload.component';
import { CreatWorkallotComponent } from './workallot-check/creat-workallot/creat-workallot.component';
import { WorkallotDetailComponent } from './workallot-check/workallot-detail/workallot-detail.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReformRoutingModule
  ],
  declarations: [ReformComponent, ReformCheckComponent, WorkallotCheckComponent, DetailComponent, FileViewComponent, FileUploadComponent,
     CreatWorkallotComponent, WorkallotDetailComponent]

})
export class ReformModule { }
