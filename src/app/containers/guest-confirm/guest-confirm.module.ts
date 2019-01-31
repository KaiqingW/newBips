import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GuestConfirmRoutingModule } from './guest-confirm-routing.module';
import { GuestConfirmComponent } from './guest-confirm.component';
import { SalesentityConfirmComponent } from './salesentity/salesentity.component';
import { SpinnerModule } from 'app/components/spinner/spinner.module';


import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports:[
        CommonModule,
        RouterModule,
        GuestConfirmRoutingModule,
        MatButtonModule,
        SpinnerModule
    ],
    declarations:[
        GuestConfirmComponent,
        SalesentityConfirmComponent
    ],
    providers:[

    ],
    exports:[
        GuestConfirmComponent
    ]
})

export class GuestConfirmModule{}