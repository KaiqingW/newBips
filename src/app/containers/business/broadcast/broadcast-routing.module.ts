import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BroadcastComponent } from './broadcast.component';
import { broadcastHeader,editEmailHeader } from 'app/core/models/header';
import { editEmailComponent } from './editEmial/editemail.component';

const broadcastRoutes: Routes =[
    {
        path:'',
        component: BroadcastComponent,
        data: broadcastHeader
    },
    {
        path:'sendEmail',
        component: editEmailComponent,
        data: editEmailHeader
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(broadcastRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class BroadcastRoutingModule{

}