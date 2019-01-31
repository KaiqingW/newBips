import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddReplyComponent } from './add-reply.component';
import { OpportunityService } from 'app/core/services/opportunity.service';
import { MatCardModule } from '@angular/material/card';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { BriefStatusCardModule } from 'app/containers/business/opportunity/components/brief-status-card/brief-status-card.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        ImgModalModule,
        SpinnerModule,
        BriefStatusCardModule
    ],
    declarations:[
        AddReplyComponent
    ],
    exports:[
        AddReplyComponent
    ],
    providers:[
        OpportunityService
    ]
})

export class AddReplyModule{

}