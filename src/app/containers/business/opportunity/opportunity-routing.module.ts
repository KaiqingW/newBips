import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { OpportunityComponent } from './opportunity.component';
import { OpportunitySettingComponent } from './containers/opportunity-setting/opportunity-setting.component';
import { AddOpportunitySettingComponent } from './containers/add-opportunity-setting/add-opportunity-setting.component';
import { InviteUserComponent } from './components/invite-user/invite-user.component';
import { AddEmployeeOpportunityComponent } from './components/add-employee/add-employee.component';
import { OpportunityEmployeeComponent } from './containers/opportunity-employee/opportunity-employee.component';
import { AddOpportunityComponent } from './containers/add-opportunity/add-opportunity.component';
import { OpportunityDetailsComponent } from './containers/opportunity-details/opportunity-details.component';
import { StatusDetailsComponent } from './components/status-details/status-details.component';
import { AddCommentComponent } from './containers/add-comment/add-comment.component';
import { AddReplyComponent } from './components/add-reply/add-reply.component';
import { AddStatusComponent } from './containers/add-status/add-status.component';
import { StatusListComponent } from './components/status-list/status-list.component';
import { AllOpportunitiesComponent } from './containers/all-opportunities/all-opportunities.component';
import { SharedOpportunitiesComponent } from './containers/shared-opportunities/shared-opportunities.component';
import { opportunitySettingHeaser, addOpportunitySettingHeader, addSharedUserHeader, addOpportunityEmployeeHeader, opportunityEmployeeHeader,
        addOpportunityHeader, opportunityDetailsHeader, oppotuntiyStatusHeader, opportunityAddCommnetHeader, opporutnityAddReplyHeader, opportunityAddStatusHeader,
        opportunitySettingStatusHeader, opportunitySettingStatusAddHeader, allOpportunitiesHeader, sharedOpportunitiesHeader  } from 'app/core/models/header';

const opportunityRoutes: Routes =[
    //opportunity Setting
    {
        path: 'opportunity-setting',
        component: OpportunitySettingComponent,
        data:opportunitySettingHeaser
    },
    {
        path: 'add-opportunity-setting',
        component: AddOpportunitySettingComponent,
        data: addOpportunitySettingHeader
    },
    {
        path: 'add-shared-user',
        component: InviteUserComponent,
        data: addSharedUserHeader
    },
    {
        path: 'opportunity-setting/status',
        component:StatusListComponent,
        data: opportunitySettingStatusHeader
    },
    {
        path: 'opportunity-setting/add-status',
        component: AddStatusComponent,
        data: opportunitySettingStatusAddHeader
    },
    {
        path:'opportunity-setting/status/:oppsId',
        component : StatusDetailsComponent,
        data: oppotuntiyStatusHeader
    },
    {
        path: 'opportunity-setting/status/:opsetsId/comment',
        component: AddCommentComponent,
        data: opportunityAddCommnetHeader
    },
    {
        path: 'opportunity-setting/status/:oppsId/comment/:opscomId/add-reply',
        component: AddReplyComponent,
        data: opporutnityAddReplyHeader

    },

    // opportunity employee
    {
        path: 'add-opportunity-employee',
        component: AddEmployeeOpportunityComponent,
        data: addOpportunityEmployeeHeader
    },
    {
        path: 'opportunity-employee/:opuserId',
        component: OpportunityEmployeeComponent,
        data: opportunityEmployeeHeader
    },
    {
        path: 'opportunity-employee/:opuserId/shared',
        component: SharedOpportunitiesComponent,
        data: sharedOpportunitiesHeader
    },

    //opportunity 
    {
        path: 'all',
        component: AllOpportunitiesComponent,
        data: allOpportunitiesHeader
    },
    {
        path: 'add-opportunity',
        component: AddOpportunityComponent,
        data: addOpportunityHeader
    },
    {
        path: 'opportunity-details/:oppId',
        component: OpportunityDetailsComponent,
        data: opportunityDetailsHeader
    },
    {
        path: 'opportunity-details/:oppId/add-status',
        component: AddStatusComponent,
        data: opportunityAddStatusHeader

    },
    {
        path: 'opportunity-status/:opsId',
        component: StatusDetailsComponent,
        data: oppotuntiyStatusHeader
        
    },
    {
        path: 'opportunity-status/:opsId/comment',
        component :AddCommentComponent,
        data: opportunityAddCommnetHeader
    },
    {
        path: 'opportunity-status/:opsId/comment/:commId/add-reply',
        component : AddReplyComponent,
        data: opporutnityAddReplyHeader
    },
    
]

@NgModule({
    imports:[
        RouterModule.forChild(opportunityRoutes)
    ],
    declarations:[

    ],
    exports:[
        RouterModule

    ],
    providers:[

    ]
})

export class opportunityRoutingModule{

}