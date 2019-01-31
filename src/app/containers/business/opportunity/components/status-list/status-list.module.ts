import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Routes } from '@angular/router';

import { StatusListComponent } from './status-list.component';
import { OpportunityService } from 'app/core/services/opportunity.service';
import { StatusCardModule } from '../status-card/status-card.module';

import { SpinnerModule } from 'app/components/spinner/spinner.module';

@NgModule({
    imports:[
        CommonModule,
        StatusCardModule,
        RouterModule,
        SpinnerModule
    ],
    declarations:[
        StatusListComponent
    ],
    providers:[
        OpportunityService
    ],
    exports:[
        StatusListComponent
    ]
})

export class StatusListModule{

}