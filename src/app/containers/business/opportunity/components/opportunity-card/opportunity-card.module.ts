import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";

import { OpportunityCardComponent } from './opportunity-card.component';
@NgModule({
    imports:[
        CommonModule,
        MatCardModule,
        CompanyLogoModule,
        FormsModule
    ],
    declarations:[
        OpportunityCardComponent
    ],
    exports:[
        OpportunityCardComponent
    ],
    providers:[

    ]
})

export class OpportunityCardModule{

}