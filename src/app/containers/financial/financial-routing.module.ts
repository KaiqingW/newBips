import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancialComponent } from './financial.component';
import { financialHeader } from 'app/core/models/header';

const financialRoutes:Routes =[
    {
        path:'fdashboard',
        component: FinancialComponent,
        data: financialHeader
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(financialRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class FinancialRoutingModule{

}
