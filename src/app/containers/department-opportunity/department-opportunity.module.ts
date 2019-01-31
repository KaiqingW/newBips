import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { EditorModule } from 'app/components/editor/editor.module';
import { MatMenuModule } from '@angular/material/menu';
import { ToasterService } from 'app/core/services/toaster.service';
import { DialogService } from 'app/core/services/dialog.service';
import { UserService } from 'app/core/services/user.service';
import { LoggingUserService} from 'app/core/services/logging-user.service';
import { ImageService } from 'app/core/services/image.service';

import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MomentModule } from 'angular2-moment/moment.module';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';
import { AvatarLogoModule } from 'app/components/avatar-logo/avatar-logo.module';
import { MatRadioModule  } from '@angular/material/radio';
import { MatListModule } from '@angular/material';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2ImgMaxModule } from 'ng2-img-max';

// service
import { BusinessMeetingService } from '../../core/services/business-meeting.service';
import { DepartmentOpportunityService } from '../../core/services/department-opportunity.service';
import { SearchService } from '../../core/services/search.service';
import { AuthService } from '../../core/services/auth.service';

// customized module
// import { CompanyLogoModule } from "app/containers/crm//components/company-logo/company-logo.module";
import { AttchmentModule } from 'app/components/attachment/attachment.module';
import { ProgressBarModule } from "app/containers/crm/components/progress-bar/progress-bar.module";
import { OppoProgressBarModule } from "app/containers/department-opportunity/components/oppo-progress-bar/oppo-progress-bar.module";
import { OpportunityAttachmentModule } from 'app/components/opportunity-attachment/opportunity-attachment.module';
import { WideSelectBarModule } from 'app/components/wide-select-bar/wide-select-bar.module';
import { OneClickDirectiveModule } from '../../directives/one-click/one-click.module';
import { DepartmentOpportunityRoutingModule } from './department-opportunity-routing.module';
import { OpportunitySubjectCardModule } from './components/opportunity-subject-card/opportunity-subject-card.module';
import { OpportunitySubjectContentModule } from './components/opportunity-subject-content/opportunity-subject-content.module';
import { PersonProjectCardModule } from './components/person-project-card/person-project-card.module';
import { ReadMoreModule } from 'app/containers/business-meeting/components/read-more/read-more.module';
import { CrmProjectCardModule } from './components/crm-project-card/crm-project-card.module';
import { CrmOppoSubjectContentModule } from './components/crm-oppo-subject-content/crm-oppo-subject-content.module';
import { OpportunityProcessAttachmentModule } from 'app/components/opportunity-process-attachment/opportunity-process-attachment.module';
import { CompanyCardModule } from "app/containers/crm/components/company-card/company-card.module";
import { LeftDayBarModule } from 'app/containers/business-meeting/components/left-day-bar/left-day-bar.module';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { ContactBarModule } from 'app/containers/crm/components/contact-card/contact-bar.module';
import { SkuProductCardModule } from 'app/containers/department-opportunity/components/sku-product-card/sku-product-card.module';
import { OppoDollarProgressBarModule } from 'app/containers/department-opportunity/components/oppo-dollar-progress-bar/oppo-dollar-progress-bar.module';

// pipe
import { ShowMorePipe } from './show-more.pipe';
import { LocalTimePipe } from './local-time.pipe';
import { ShortTextPipe }  from './short-text.pipe';

// components
import { DepartmentOpportunityComponent } from './department-opportunity.component';
import { OpportunityListComponent } from './containers/opportunity-list/opportunity-list.component';
import { AddOpportunityComponent } from './containers/opportunity-list/add-opportunity/add-opportunity.component';
import { OpportunitySubjectComponent } from './containers/opportunity-list/opportunity-subject/opportunity-subject.component';
import { DiscussionBriefComponent } from './components/discussion-brief/discussion-brief.component';
import { AddOpportunityPersonProjectComponent } from './containers/add-opportunity-person-project/add-opportunity-person-project.component';
import { OpportunityPersonProjectComponent } from './containers/opportunity-person-project/opportunity-person-project.component';
import { OpportunityShareComponent } from './containers/opportunity-share/opportunity-share.component';
import { OpportunitySubjectDiscussionComponent } from './containers/opportunity-subject-discussion/opportunity-subject-discussion.component';
import { OpportunityPersonProjectDiscussionComponent } from './containers/opportunity-person-project-discussion/opportunity-person-project-discussion.component';
import { StatusCardComponent } from './components/status-card/status-card.component';
import { AddStatusComponent } from './containers/opportunity-person-project/add-status/add-status.component';
import { AddReplyComponent } from './containers/opportunity-person-project/add-reply/add-reply.component';
import { PersonProjectCardBriefComponent } from './components/person-project-card-brief/person-project-card-brief.component';
import { AddCommentComponent } from './containers/add-comment/add-comment.component';
import { EditOpportunityComponent } from './containers/opportunity-list/edit-opportunity/edit-opportunity.component';
import { NextSalesPersonOpportunityListComponent } from './containers/next-sales-person-opportunity-list/next-sales-person-opportunity-list.component';
import { AddSalesCustomerOpportunityComponent } from './containers/next-sales-person-opportunity-list/add-sales-customer-opportunity/add-sales-customer-opportunity.component';
import { AddSalesCustomerProductProjectComponent } from './containers/add-sales-customer-product-project/add-sales-customer-product-project.component';
import { NextSalesOpportunitySubjectComponent } from './containers/next-sales-person-opportunity-list/next-sales-opportunity-subject/next-sales-opportunity-subject.component';
import { ProjectAssignComponent } from './containers/project-assign/project-assign.component';
import { EditProjectComponent } from './containers/opportunity-person-project/edit-project/edit-project.component';
import { NextSalesOpportunityShareComponent } from './containers/next-sales-opportunity-share/next-sales-opportunity-share.component';
import { OthersSharedOpportunityProjectListComponent } from './containers/others-shared-opportunity-project-list/others-shared-opportunity-project-list.component';
import { NextSalesProjectListComponent } from './containers/next-sales-person-opportunity-list/next-sales-project-list/next-sales-project-list.component';
import { OthersSharedOpportunityListComponent } from './containers/others-shared-opportunity-project-list/others-shared-opportunity-list/others-shared-opportunity-list.component';
import { OpportunityStepSettingComponent } from './containers/opportunity-list/opportunity-step-setting/opportunity-step-setting.component';
import { AddOpportunityStepComponent } from './containers/opportunity-list/add-opportunity-step/add-opportunity-step.component';
import { ProcessCardComponent } from './components/process-card/process-card.component';
import { AddProcessAdministratorComponent } from './containers/opportunity-list/add-process-administrator/add-process-administrator.component';
import { MoreOpportunityOwnerListComponent } from './containers/more-opportunity-owner-list/more-opportunity-owner-list.component';
import { AddMessageComponent } from './containers/opportunity-person-project/add-message/add-message.component';
import { AddApprovalComponent } from './containers/opportunity-person-project/add-approval/add-approval.component';
import { MoreProcessAdministratorsComponent } from './containers/opportunity-list/more-process-administrators/more-process-administrators.component';
import { AddApproveDenyComponent } from './containers/opportunity-person-project/add-approve-deny/add-approve-deny.component';
import { ChooseSearchInventoryOrAddSKUComponent } from './containers/choose-search-inventory-or-add-sku/choose-search-inventory-or-add-sku.component';
import { SearchInventoryComponent } from './containers/choose-search-inventory-or-add-sku/search-inventory/search-inventory.component';


@NgModule({
  imports: [
    DepartmentOpportunityRoutingModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    EditorModule,
    MatDialogModule,
    SpinnerModule,
    AddButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    ImgModalModule,
    MatChipsModule,
    MatTabsModule,
    MomentModule,
    MatCheckboxModule,
    Ng2ImgMaxModule,
    MatRadioModule,
    MatListModule,
    
    // customised module
    AttchmentModule,
    OpportunityAttachmentModule,
    ProfilePictureModule,
    AvatarLogoModule,
    OpportunitySubjectCardModule,
    WideSelectBarModule,
    OneClickDirectiveModule,
    OpportunitySubjectContentModule,
    PersonProjectCardModule,
    LeftDayBarModule,
    ProgressBarModule,
    ReadMoreModule,
    CrmProjectCardModule,
    CrmOppoSubjectContentModule,
    OpportunityProcessAttachmentModule,
    CompanyCardModule,
    CompanyLogoModule,
    ContactBarModule,
    OppoProgressBarModule,
    SkuProductCardModule,
    OppoDollarProgressBarModule,
    
  ],
  declarations: [
    DepartmentOpportunityComponent,
    OpportunityListComponent,
    ShowMorePipe,
    AddOpportunityComponent,
    OpportunitySubjectComponent,
    DiscussionBriefComponent,
    AddOpportunityPersonProjectComponent,
    OpportunityPersonProjectComponent,
    OpportunityShareComponent,
    OpportunitySubjectDiscussionComponent,
    OpportunityPersonProjectDiscussionComponent,
    StatusCardComponent,
    AddStatusComponent,
    AddReplyComponent,
    PersonProjectCardBriefComponent,
    AddCommentComponent,
    EditOpportunityComponent,
    LocalTimePipe,
    ShortTextPipe,
    NextSalesPersonOpportunityListComponent,
    AddSalesCustomerOpportunityComponent,
    AddSalesCustomerProductProjectComponent,
    NextSalesOpportunitySubjectComponent,
    ProjectAssignComponent,
    EditProjectComponent,
    NextSalesOpportunityShareComponent,
    OthersSharedOpportunityProjectListComponent,
    NextSalesProjectListComponent,
    OthersSharedOpportunityListComponent,
    OpportunityStepSettingComponent,
    AddOpportunityStepComponent,
    ProcessCardComponent,
    AddProcessAdministratorComponent,
    MoreOpportunityOwnerListComponent,
    AddMessageComponent,
    AddApprovalComponent,
    MoreProcessAdministratorsComponent,
    AddApproveDenyComponent,
    ChooseSearchInventoryOrAddSKUComponent,
    SearchInventoryComponent,
    
    
  ],
  exports: [
    
  ],
  providers: [
    ToasterService,
    DialogService,
    UserService,
    ImageService,
    LoggingUserService,
    BusinessMeetingService,
    DepartmentOpportunityService,
    SearchService,
    AuthService
  ],
})

export class DepartmentOpportunityModule {}
