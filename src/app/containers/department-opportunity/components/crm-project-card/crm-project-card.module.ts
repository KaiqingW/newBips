import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatCardModule } from '@angular/material/card';
import { CrmProjectCardComponent } from './crm-project-card.component';


import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentOpportunityRoutingModule } from '../../department-opportunity-routing.module';
import { MomentModule } from 'angular2-moment/moment.module';

import { AvatarLogoModule } from 'app/components/avatar-logo/avatar-logo.module';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';

// service
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

// pipe
import { ShortTextPipe }  from './short-text.pipe';
import { ShowMorePipe } from './show-more.pipe';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatCardModule,
        CompanyLogoModule,
        MatIconModule,
        MatButtonModule,
        DepartmentOpportunityRoutingModule,
        AvatarLogoModule,
        MomentModule,
        ImgModalModule
    ],
    declarations:[
        CrmProjectCardComponent,
        ShortTextPipe,
        ShowMorePipe,
    ],
    exports:[
        CrmProjectCardComponent
    ],
    providers:[
        DepartmentOpportunityService
    ]
})

export class CrmProjectCardModule{

}