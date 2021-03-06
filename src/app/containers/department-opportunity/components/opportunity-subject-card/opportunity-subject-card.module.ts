import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MomentModule } from 'angular2-moment/moment.module';

import { MatCardModule } from '@angular/material/card';
import { OpportunitySubjectCardComponent } from '../../components/opportunity-subject-card/opportunity-subject-card.component';

import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { ProgressBarModule } from "app/containers/crm/components/progress-bar/progress-bar.module";
import { LocalTimePipe } from './local-time.pipe';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatCardModule,
        CompanyLogoModule,
        ProgressBarModule,
        MomentModule
     
    ],
    declarations:[
        OpportunitySubjectCardComponent,
        LocalTimePipe
    ],
    exports:[
        OpportunitySubjectCardComponent
    ],
    providers:[]
})

export class OpportunitySubjectCardModule{

}