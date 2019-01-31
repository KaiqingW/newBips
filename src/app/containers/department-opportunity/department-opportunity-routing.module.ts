import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { commentReplyHeader, 
    meetingNoteDiscussionHeader, 
    meetingNoteHeader, 
    meetingSubjectHeader, 
    meetingListHeader, 
    companySubjectListHeader, 
    subjectListHeader, 
    subjectHeader,
    addNoteHeader,
    noteHeader,

    businessMeetingSubjectHeader,
    businessMeetingProjectHeader,
    subjectShareHeader, 
    assignHeader, 
    nextBusinessMeetingSubjectHeader,
    addNextSubjectHeader,
    projectAssignHeader,
    moreSharedUserHeader,

    // oportunity
    departmentOpportunityListHeader,
    addSubjectHeader, 
    editSubjectHeader,    
    opportunitySubjectHeader,
    addProjectHeader, 
    opportunityPersonProjectHeader,
    opportunityShareHeader,
    subjectDiscussionHeader,
    projectDiscussionHeader,
    addStatusHeader,
    addReplyHeader,
    commentHeader,
    salesDepartmentOpportunityListHeader,
    addCustomerOpportunityHeader,
    addSalesOpportunityProjectHeader,
    crmOpportunityHeader,
    editProjectHeader,
    setUpOpportunityHeader,
    sharedOpportunityProjectListHeader,
    addProcessHeader,
    addPeopleHeader,
    ownerListHeader,
    addMessageHeader,
    addApprovalHeader,
    processAdministratorListHeader,
    chooseHeader,
    searchInventoryHeader,

} from 'app/core/models/header';

// components
import { OpportunityListComponent } from './containers/opportunity-list/opportunity-list.component';
import { AddOpportunityComponent } from './containers/opportunity-list/add-opportunity/add-opportunity.component';
import { OpportunitySubjectComponent } from './containers/opportunity-list/opportunity-subject/opportunity-subject.component';
import { AddOpportunityPersonProjectComponent } from './containers/add-opportunity-person-project/add-opportunity-person-project.component';
import { OpportunityPersonProjectComponent } from './containers/opportunity-person-project/opportunity-person-project.component';
import { OpportunityShareComponent } from './containers/opportunity-share/opportunity-share.component';
import { OpportunitySubjectDiscussionComponent } from './containers/opportunity-subject-discussion/opportunity-subject-discussion.component';
import { OpportunityPersonProjectDiscussionComponent } from './containers/opportunity-person-project-discussion/opportunity-person-project-discussion.component';
import { AddStatusComponent } from './containers/opportunity-person-project/add-status/add-status.component';
import { AddReplyComponent } from './containers/opportunity-person-project/add-reply/add-reply.component';
import { AddCommentComponent } from './containers/add-comment/add-comment.component';
import { EditOpportunityComponent } from './containers/opportunity-list/edit-opportunity/edit-opportunity.component';
import { NextSalesPersonOpportunityListComponent } from './containers/next-sales-person-opportunity-list/next-sales-person-opportunity-list.component';
import { AddSalesCustomerOpportunityComponent } from './containers/next-sales-person-opportunity-list/add-sales-customer-opportunity/add-sales-customer-opportunity.component';
import { NextSalesOpportunitySubjectComponent } from './containers/next-sales-person-opportunity-list/next-sales-opportunity-subject/next-sales-opportunity-subject.component';
import { AddSalesCustomerProductProjectComponent } from './containers/add-sales-customer-product-project/add-sales-customer-product-project.component';
import { ProjectAssignComponent } from './containers/project-assign/project-assign.component';
import { EditProjectComponent } from './containers/opportunity-person-project/edit-project/edit-project.component';
import { NextSalesOpportunityShareComponent } from './containers/next-sales-opportunity-share/next-sales-opportunity-share.component';
import { OthersSharedOpportunityProjectListComponent } from './containers/others-shared-opportunity-project-list/others-shared-opportunity-project-list.component';
import { NextSalesProjectListComponent } from './containers/next-sales-person-opportunity-list/next-sales-project-list/next-sales-project-list.component';
import { OthersSharedOpportunityListComponent } from './containers/others-shared-opportunity-project-list/others-shared-opportunity-list/others-shared-opportunity-list.component';
import { OpportunityStepSettingComponent } from './containers/opportunity-list/opportunity-step-setting/opportunity-step-setting.component';
import { AddOpportunityStepComponent } from './containers/opportunity-list/add-opportunity-step/add-opportunity-step.component';
import { AddProcessAdministratorComponent } from './containers/opportunity-list/add-process-administrator/add-process-administrator.component';
import { MoreOpportunityOwnerListComponent } from './containers/more-opportunity-owner-list/more-opportunity-owner-list.component';
import { AddMessageComponent } from './containers/opportunity-person-project/add-message/add-message.component';
import { MoreProcessAdministratorsComponent } from './containers/opportunity-list/more-process-administrators/more-process-administrators.component';
import { AddApproveDenyComponent } from './containers/opportunity-person-project/add-approve-deny/add-approve-deny.component';
import { ChooseSearchInventoryOrAddSKUComponent } from './containers/choose-search-inventory-or-add-sku/choose-search-inventory-or-add-sku.component';
import { SearchInventoryComponent } from './containers/choose-search-inventory-or-add-sku/search-inventory/search-inventory.component';

const departmentOpportunityRoutes: Routes = [

    // opportunity routes
    // {
    //     path: 'opportunity-subject',
    //     component: OpportunityListComponent,
    //     data: departmentOpportunityListHeader
    // },

    
    /*others will see the shared crm opportunity and shared project list */
    {
        path: 'opportunity-subject/:oppoSubjectId/shared-opportunity-list',
        component: OthersSharedOpportunityProjectListComponent,
        data: sharedOpportunityProjectListHeader, 
    },
    {
        path: 'opportunity-subject/:oppoSubjectId/shared-customer-opportunity-list',
        component: OthersSharedOpportunityListComponent,
        data: sharedOpportunityProjectListHeader, 
    },

    /*the admin of the opportunity will see the setting and main page of the opportunity*/
    {
        path: 'add-opportunity-subject',
        component: AddOpportunityComponent,
        data: addSubjectHeader
    },
    {
        path: 'opportunity-subject/:oppoSubjectId/opportunity-step-setting',
        component: OpportunityStepSettingComponent,
        data: setUpOpportunityHeader
    },
    {
        path: 'opportunity-subject/:oppoSubjectId/opportunity-step-setting/add-opportunity-step',
        component: AddOpportunityStepComponent,
        data: addProcessHeader
    },
    {
        path: 'opportunity-subject/:oppoSubjectId/opportunity-step-setting/process/:oppoProcessId/add-process-administrator',
        component: AddProcessAdministratorComponent,
        data: addPeopleHeader
    },
    {
        path: 'opportunity-subject/:oppoSubjectId/opportunity-step-setting/process/:oppoProcessId/all-process-administrator',
        component: MoreProcessAdministratorsComponent,
        data: processAdministratorListHeader
    },
    {
        path: 'opportunity-subject/:oppoSubjectId',
        component: OpportunitySubjectComponent,
        data: opportunitySubjectHeader
    },
    {
        path: 'opportunity-subject/:oppoSubjectId/edit-opportunity-subject',
        component: EditOpportunityComponent,
        data: editSubjectHeader
    },
    {
        path: 'opportunity-subject/:oppoSubjectId/share',
        component: OpportunityShareComponent,
        data: opportunityShareHeader
    },
    {
        path: 'opportunity-subject/:oppoSubjectId/add-opportunity-person-project',
        component: AddOpportunityPersonProjectComponent,
        data: addSalesOpportunityProjectHeader
    },
    // {
    //     path: 'opportunity-subject/:oppoSubjectId/opportunity-person-project/:oppoProjectId',
    //     component: OpportunityPersonProjectComponent,
    //     data: opportunityPersonProjectHeader
    // },
    // {
    //     path: 'opportunity-subject/:oppoSubjectId/opportunity-person-project/:oppoProjectId/discussion/add-comment',
    //     component: AddCommentComponent,
    //     data: commentHeader
    // },
    // {
    //     path: 'opportunity-subject/:oppoSubjectId/opportunity-person-project/:oppoProjectId/discussion/comment/:oppoStatusId/add-reply',
    //     component: AddReplyComponent,
    //     data: addReplyHeader
    // },
    // {
    //     path: 'opportunity-subject/:oppoSubjectId/opportunity-person-project/:oppoProjectId/opportunity-status/:oppoStatusId/add-reply',
    //     component: AddReplyComponent,
    //     data: addReplyHeader
    // },

    /*sales will see the crm opportunity that he created and all proect lists that he created*/
    // prev project (next level subject)
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-list',
        component: NextSalesPersonOpportunityListComponent,
        data: salesDepartmentOpportunityListHeader
    },
    // crm project list page
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-project-list',
        component: NextSalesProjectListComponent,
        data: salesDepartmentOpportunityListHeader
    },
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-project-list/crm-opportunity-project/:oppoProjectId/all-opportunity-owner',
        component: MoreOpportunityOwnerListComponent,
        data: ownerListHeader
    },
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/add-customer-opportunity',
        component: AddSalesCustomerOpportunityComponent,
        data: addCustomerOpportunityHeader
    },
    // prev project -> next subject
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId',
        component: NextSalesOpportunitySubjectComponent,
        data: crmOpportunityHeader
    },
    // next subject discussion
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/discussion',
        component: OpportunitySubjectDiscussionComponent,
        data: subjectDiscussionHeader
    },
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/discussion/:oppoProjectId/add-comment',
        component: AddCommentComponent,
        data: commentHeader
    },
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/discussion/comment/:oppoStatusId/add-reply',
        component: AddReplyComponent,
        data: addReplyHeader
    },
    // next subject share
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/share',
        component: NextSalesOpportunityShareComponent,
        data: opportunityShareHeader
    },
    // add project
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/add-sales-customer-product-project',
        component: AddSalesCustomerProductProjectComponent,
        data: addProjectHeader
    },
    // next subject project
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId',
        component: OpportunityPersonProjectComponent,
        data: opportunityPersonProjectHeader
    },
    // choose search inventory or add sku
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/choose-search-inventory-or-add-sku',
        component: ChooseSearchInventoryOrAddSKUComponent,
        data: chooseHeader
    },
    // search inventory
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/choose-search-inventory-or-add-sku/search-inventory',
        component: SearchInventoryComponent,
        data: searchInventoryHeader
    },
    // edit project
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/edit-project',
        component: EditProjectComponent,
        data: editProjectHeader
    },
    // next subject project -> assign owner
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/assign-owner',
        component: ProjectAssignComponent,
        data: projectAssignHeader
    },
    // next subject -> project discussion
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/discussion',
        component: OpportunityPersonProjectDiscussionComponent,
        data: projectDiscussionHeader
    },
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/discussion/add-comment',
        component: AddCommentComponent,
        data: commentHeader
    },
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/discussion/comment/:oppoStatusId/add-reply',
        component: AddReplyComponent,
        data: addApprovalHeader
    },
    // add-status
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/add-status',
        component: AddStatusComponent,
        data: addStatusHeader
    },
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/add-message',
        component: AddMessageComponent,
        data: addMessageHeader
    },
    // add-approve-deny
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/add-approve-deny',
        component: AddApproveDenyComponent,
        data: addApprovalHeader
    },
    // add status-reply
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/opportunity-status/:oppoStatusId/add-reply',
        component: AddReplyComponent,
        data: addReplyHeader
    },
    // more opportunity owners
    {
        path: 'opportunity-person-project/:oppoPrevProjectId/sales-opportunity-subject/:oppoSubjectId/crm-opportunity-project/:oppoProjectId/all-opportunity-owner',
        component: MoreOpportunityOwnerListComponent,
        data: ownerListHeader
    },

    
];

@NgModule({
    imports:[
        RouterModule.forChild(departmentOpportunityRoutes),
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class DepartmentOpportunityRoutingModule{

}
