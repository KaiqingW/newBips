import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrcaMapComponent } from './orcamap.component';

import { orcaMapHeader } from 'app/core/models/header';


const orcaMapRoutes : Routes =[
    {
        path:'map',
        component: OrcaMapComponent,
        data : orcaMapHeader
    }

]

@NgModule({
    imports:[
        RouterModule.forChild(orcaMapRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class OrcaMapRoutingModule{

}