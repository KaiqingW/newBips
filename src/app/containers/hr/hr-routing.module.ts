import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeComponent } from './containers/employee/employee.component';
import { CandidateComponent } from './containers/candidate/candidate.component';
import { ResumeComponent } from './containers/resume/resume.component';
import { HumanDetailsComponent } from './components/human-details/human-details.component';
import { AddHumanComponent } from './containers/add-human/add-human.component';

import { employeeHeader,addHumanHeader,humanDetailsHeader } from 'app/core/models/header';
const hrRoutes: Routes=[
    {
        path: 'add-human',
        component:AddHumanComponent,
        data: addHumanHeader
    },
    {
        path:'employee',
        component: EmployeeComponent,
        data: employeeHeader
    },
    {
        path:'employee/:humanid',
        component: HumanDetailsComponent,
        data: humanDetailsHeader
    },

    {
        path:'candidate',
        component: CandidateComponent,
        data: employeeHeader
    },
    {
        path:'candidate/:humanid',
        component: HumanDetailsComponent,
        data: humanDetailsHeader
    },

    {
        path:'resume',
        component: ResumeComponent,
        data: employeeHeader
    },
    {
        path:'resume/:humanid',
        component: HumanDetailsComponent,
        data: humanDetailsHeader
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(hrRoutes),
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class HrRoutingModule{
    
}