import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { OpportunityDetailComponent } from './containers/opportunity-detail/opportunity-detail.component'
import { OpportunityComponent } from './opportunity.component';
import { AddOpportunityComponent } from './containers/add-opportunity/add-opportunity.component';
import { RequestInfoComponent } from './components/request-info/request-info.component';
import { RequestPriceComponent } from './components/request-price/request-price.component';


import { opportunitiesHeader, opportunityDetailHeader, addOpportunityHeader, requestInfoHeader, requestPriceHeader } from 'app/core/models/header';

const opportunityRoutes: Routes = [
//    {
//        path:'',
//        component: OpportunityComponent,
//        data: opportunitiesHeader
//    },
//    {
//         path:'add-opportunity',
//         component:  AddOpportunityComponent,
//         data: addOpportunityHeader
//    },
//    {
//        path:':oppid',
//        component: OpportunityDetailComponent,
//        data: opportunityDetailHeader
//    },
//    {
//         path:':oppid/request-price',
//         component: RequestPriceComponent,
//         data: requestPriceHeader
//    },
//    {
//         path:':oppid/request-info',
//         component: RequestInfoComponent,
//         data: requestInfoHeader
//    },
//    {
//         path: ':oppid/notes',
//         loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
//     },

//     {
//         path: ':oppid/salesentity/quota',
//         loadChildren:'app/components/business-quota/business-quota.module#BusinessQuotasModule',
//     },

]

@NgModule({
    imports:[
        RouterModule.forChild(opportunityRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class OpportunityRoutingModule{

}

