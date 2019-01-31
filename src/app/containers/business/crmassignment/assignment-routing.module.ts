import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrmAssignmentComponent } from './assignment.component';
import { CustomerListComponent } from './containers/customer-list/customer-list.component';
import { crmAssignmentListHeader } from 'app/core/models/header';

const crmassignmentRoutes: Routes=[
    {
        path: '',
        component: CrmAssignmentComponent,
        data: crmAssignmentListHeader
    },
    {
        path:'assignmentList',
        component: CustomerListComponent
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(crmassignmentRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class CrmAssignmentRoutingModule{
    
}