import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskManagementComponent } from './task-management.component';
import { TackManagementsComponent } from './tack-managements/tack-managements.component';
import { CreateTaskComponent } from './tack-managements/create-task/create-task.component';
import { InformationComponent } from './tack-managements/information/information.component';
import { TaskProgressComponent } from './tack-managements/task-progress/task-progress.component';



const routes: Routes = [
    {
        path: '',
        component: TaskManagementComponent,
        children: [
            {
                path: 'taskManagement', component: TackManagementsComponent, data: {
                    breadcrumb: '任务管理'
                }
            },
            {
                path: 'taskManagement/createTask',
                component: CreateTaskComponent,
                data: {
                    breadcrumb: '任务管理'
                }
            },
            {
                path: 'taskManagement/information',
                component: InformationComponent,
                data: {
                    breadcrumb: '任务管理'
                }
            },
            {
                path: 'taskManagement/taskProgress',
                component: TaskProgressComponent,
                data: {
                    breadcrumb: '任务管理'
                }
            },
        ],
        data: {
            breadcrumb: '非现场检查任务管理'
        }
    }];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskMangementRoutingModule { }
