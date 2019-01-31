import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { CompanyLogoModule } from "app/containers/crm//components/company-logo/company-logo.module";
import { ReadMoreModule } from 'app/containers/business-meeting/components/read-more/read-more.module';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { BriefStatusCardComponent } from './brief-status-card.component';
import { OpportunityService } from 'app/core/services/opportunity.service';
@NgModule({
    imports:[
        CommonModule,
        MatCardModule,
        CompanyLogoModule,
        ReadMoreModule,
        ImgModalModule
    ],
    declarations:[
        BriefStatusCardComponent
    ],
    providers:[
        OpportunityService
    ],
    exports:[
        BriefStatusCardComponent
    ]

})

export class BriefStatusCardModule{

}