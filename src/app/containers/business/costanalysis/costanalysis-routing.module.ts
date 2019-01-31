import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { AddCostAnalysisComponent } from './containers/add-costanalysis/add-costanalysis.component';
import { CostAnalysisDetailsComponent } from './containers/costanalysisdetails/costanalysisdetails.component';
import { CostAnlaysisListComponent } from './containers/costanalysislist/costanalysislist.component';

import { costAnalysisListHeader, addCostAnalysisHeader, costAnalysisdetailHeader} from 'app/core/models/header';
const costanalysisRoutes: Routes = [
    {
        path:'list',
        component: CostAnlaysisListComponent,
        data: costAnalysisListHeader

    },
    {
        path:'add',
        component: AddCostAnalysisComponent,
        data: addCostAnalysisHeader
    },
    {
        path:':costId',
        component: CostAnalysisDetailsComponent,
        data : costAnalysisdetailHeader
    },
    
]

@NgModule ({
    imports :[
        RouterModule.forChild(costanalysisRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers:[

    ]

})

export class CostAnalysisRoutingModule{

}
