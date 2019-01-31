import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesentityConfirmComponent } from './salesentity/salesentity.component';
import { customerConfirmHeader } from 'app/core/models/header';

 const GuestConfirmRoutes: Routes = [
    {
        path:'salesentity/:cid/:sid',
        component: SalesentityConfirmComponent,
        data: customerConfirmHeader
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(GuestConfirmRoutes),
    ],
    exports:[

    ],
    providers:[

    ]
})

export class GuestConfirmRoutingModule{

}