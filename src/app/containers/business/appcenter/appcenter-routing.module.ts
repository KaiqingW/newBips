import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppCenterComponent } from './appcenter.component';
import { appCenterHeader } from 'app/core/models/header';

const appCenterRoutes: Routes =[
    {
        path:'',
        component:AppCenterComponent,
        data: appCenterHeader
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(appCenterRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class AppCenterRoutingModule{}
