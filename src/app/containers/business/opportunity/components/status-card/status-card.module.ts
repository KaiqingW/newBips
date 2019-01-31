import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StatusCardComponent } from './status-card.component';
import { OpportunityService } from 'app/core/services/opportunity.service';
import { MatCardModule } from '@angular/material/card';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { ReadMoreModule } from 'app/containers/business-meeting/components/read-more/read-more.module';
@NgModule({
    imports:[
        CommonModule,
        MatCardModule,
        CompanyLogoModule,
        ImgModalModule,
        ReadMoreModule,
        RouterModule
    ],
    declarations:[
        StatusCardComponent
    ],
    exports:[
        StatusCardComponent
    ],
    providers:[

    ]
})

export class StatusCardModule{

}