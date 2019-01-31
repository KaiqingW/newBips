import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HumanCardComponent } from './human-card.component';
import { CompanyLogoModule } from "../../../crm/components/company-logo/company-logo.module";
import { MatCardModule } from '@angular/material/card';

@NgModule({
   imports:[
    CommonModule,
    CompanyLogoModule,
    MatCardModule
   ],

    declarations:[
        HumanCardComponent
    ],
    exports:[
        HumanCardComponent
    ],
    providers:[
        
    ]
})

export class HumanCardModule{
    
}