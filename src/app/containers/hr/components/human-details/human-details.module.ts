import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HumanDetailsComponent } from './human-details.component';
import { CompanyLogoModule } from "../../../crm/components/company-logo/company-logo.module";
import { PanelCardModule } from "../../../crm/components/panel-card/panel-card.module";

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports:[
        CommonModule,
        CompanyLogoModule,
   
        PanelCardModule,

        MatIconModule,
        MatCardModule,
        MatButtonModule
    ],
    declarations:[
        HumanDetailsComponent
    ],
    exports:[
        HumanDetailsComponent
    ],
    providers:[
        
    ]
})

export class HumanDetailsModule{
    
}