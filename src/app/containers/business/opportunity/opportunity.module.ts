import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

//opportunity component
import { OpportunityComponent } from './opportunity.component';
import { OpportunitySettingComponent } from './containers/opportunity-setting/opportunity-setting.component';
import { AddOpportunitySettingComponent} from './containers/add-opportunity-setting/add-opportunity-setting.component';
import { OpportunityEmployeeComponent } from './containers/opportunity-employee/opportunity-employee.component';
import { OpportunityDetailsComponent } from './containers/opportunity-details/opportunity-details.component';
import { AddOpportunityComponent } from './containers/add-opportunity/add-opportunity.component';
import { OpportunityStatusComponent } from './containers/opportunity-status/opportunity-status.component';
import { SharedOpportunitiesComponent } from './containers/shared-opportunities/shared-opportunities.component';
import { AllOpportunitiesComponent } from './containers/all-opportunities/all-opportunities.component';

import { opportunityRoutingModule } from './opportunity-routing.module';
import { StatusDetailsModule } from './components/status-details/status-details.module';
import { AddCommentComponent } from './containers/add-comment/add-comment.component';
import { AddReplyModule } from './components/add-reply/add-reply.module';
import { StatusCardModule } from './components/status-card/status-card.module';
import { SubjectContentModule } from './components/status-content/status-content.module';
import { OpportunityService } from 'app/core/services/opportunity.service';
import { AddStatusComponent } from './containers/add-status/add-status.component';
import { OpportunityCardModule } from './components/opportunity-card/opportunity-card.module';
import { InviteUserModule } from './components/invite-user/invite-user.module';
import { AddEmployeeOpportunityModule } from './components/add-employee/add-employee.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';
import { AttchmentModule } from 'app/components/attachment/attachment.module';
import { EmployeeCardModule } from './components/employee-card/employee-card.module';
import { PanelCardModule } from 'app/containers/crm/components/panel-card/panel-card.module';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { BriefStatusCardModule } from 'app/containers/business/opportunity/components/brief-status-card/brief-status-card.module';
import { StatusListModule } from './components/status-list/status-list.module';

//angular material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        opportunityRoutingModule,
        AddButtonModule,
        SpinnerModule,
        ProfilePictureModule,
        AttchmentModule,
        EmployeeCardModule,
        PanelCardModule,
        InviteUserModule,
        AddEmployeeOpportunityModule,
        StatusDetailsModule,
        ImgModalModule,
        AddReplyModule,
        StatusCardModule,
        SubjectContentModule,
        StatusListModule,
        OpportunityCardModule,

        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        BriefStatusCardModule
    ],
    declarations:[
        OpportunityComponent,
        OpportunitySettingComponent,
        AddOpportunitySettingComponent,
        OpportunityEmployeeComponent,
        OpportunityDetailsComponent,
        AddOpportunityComponent,
        OpportunityStatusComponent,
        AddCommentComponent,
        AddStatusComponent,
        SharedOpportunitiesComponent,
        AllOpportunitiesComponent
    ],
    exports:[
        OpportunitySettingComponent
    ],
    providers:[
        OpportunityService
    ]

})

export class OpportunityModule{

}