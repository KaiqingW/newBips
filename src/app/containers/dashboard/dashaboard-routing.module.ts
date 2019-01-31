import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesDashboardComponent } from "./containers/sales-dashboard/sales-dashboard.component";
import { DashboardComponent } from "./dashboard.component";
import { dashboardHeader} from "../../core/models/header";
const dashboardRoutes: Routes = [
    // {
    //     path: '',
    //     component: DashboardComponent,
    //     children:[
    //         {
    //             path:'',
    //             redirectTo:'/dashboard',
    //             pathMatch:'full'
    //         },
    //     ],
        
    // },
    {
        path:'',
        component:SalesDashboardComponent,
        data: dashboardHeader
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(dashboardRoutes),
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class DashboardRoutingModule{

}