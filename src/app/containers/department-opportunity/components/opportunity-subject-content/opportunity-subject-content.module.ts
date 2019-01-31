import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { OpportunitySubjectContentComponent } from './opportunity-subject-content.component';
import { MomentModule } from 'angular2-moment/moment.module';

import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { ReadMoreModule } from 'app/containers/business-meeting/components/read-more/read-more.module';
import { LocalTimePipe } from './local-time.pipe';

@NgModule({
    imports:[
        CommonModule,
        MatCardModule,    
        ImgModalModule,
        ReadMoreModule,
        MatIconModule,
        ReadMoreModule,
        ImgModalModule,
        MomentModule
    ],
    declarations:[
        OpportunitySubjectContentComponent,
        LocalTimePipe
    ],
    exports:[
        OpportunitySubjectContentComponent
    ],
    providers:[]
})

export class OpportunitySubjectContentModule{

}