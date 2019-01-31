import { NgModule , ModuleWithProviders} from '@angular/core';
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

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { BusinessMeetingService } from '../../core/services/business-meeting.service';
import { CommonService } from 'app/core/services/common.service';

// customized module
import { BusinessMeetingRoutingModule } from './business-meeting-routing.module';
import { SubjectCardModule } from './components/subject-card/subject-card.module';
import { ProjectCardModule } from './components/project-card/project-card.module';
import { SubjectContentModule } from './components/subject-content/subject-content.module';
// import { CompanyLogoModule } from "app/containers/crm//components/company-logo/company-logo.module";
import { AttchmentModule } from 'app/components/attachment/attachment.module';
import { ProgressBarModule } from "app/containers/crm/components/progress-bar/progress-bar.module";
import { LeftDayBarModule } from './components/left-day-bar/left-day-bar.module';
import { ReadMoreModule } from './components/read-more/read-more.module';
import { WideSelectBarModule } from 'app/components/wide-select-bar/wide-select-bar.module';
import { OneClickDirectiveModule } from '../../directives/one-click/one-click.module';
import { SendEmailMessageModule } from 'app/components/send-email-message/send-email-message.module';

// pipe
import { ShowMorePipe } from './show-more.pipe';
import { LocalTimePipe } from './local-time.pipe';

// component
import { BusinessMeetingComponent } from './business-meeting.component';
import { SubjectListComponent } from './containers/subject-list/subject-list.component';
import { SubjectComponent } from './containers/subject-list/subject/subject.component';
import { SharedSubjectListComponent } from './containers/shared-subject-list/shared-subject-list.component';
import { FinishedSubjectListComponent } from './containers/finished-subject-list/finished-subject-list.component';
import { AddSubjectComponent } from './containers/subject-list/add-subject/add-subject.component';
import { DiscussionBriefComponent } from './components/discussion-brief/discussion-brief.component';
import { AddProjectComponent } from './containers/add-project/add-project.component';
import { SubjectProjectComponent } from './containers/subject-project/subject-project.component';
import { AddStatusComponent } from './containers/subject-project/add-status/add-status.component';
import { StatusCardComponent } from './components/status-card/status-card.component';
import { AddReplyComponent } from './containers/subject-project/add-reply/add-reply.component';
import { SubjectDiscussionComponent } from './containers/subject-discussion/subject-discussion.component';
import { ProjectDiscussionComponent } from './containers/project-discussion/project-discussion.component';
import { AddCommentComponent } from './containers/add-comment/add-comment.component';
import { ProjectCardBriefComponent } from './components/project-card-brief/project-card-brief.component';
import { SubjectShareComponent } from './containers/subject-share/subject-share.component';
import { ProjectAssignComponent } from './containers/project-assign/project-assign.component';
import { ProjectNextSubjectListComponent } from './containers/project-next-subject-list/project-next-subject-list.component';
import { MoreSharedUserListComponent } from './containers/more-shared-user-list/more-shared-user-list.component';
import { EditSubjectComponent } from './containers/subject-list/edit-subject/edit-subject.component';
import { EditProjectComponent } from './containers/subject-project/edit-project/edit-project.component';
import { MoreProjectOwnerListComponent } from './containers/more-project-owner-list/more-project-owner-list.component';

@NgModule({
  imports: [
    BusinessMeetingRoutingModule,
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

    // customised module
    ProfilePictureModule,
    AvatarLogoModule,
    // CompanyLogoModule,
    SubjectCardModule,
    SubjectContentModule,
    AttchmentModule,
    ProjectCardModule,
    ProgressBarModule,
    LeftDayBarModule,
    ReadMoreModule,
    WideSelectBarModule,
    OneClickDirectiveModule,
    SendEmailMessageModule
  ],
  declarations: [
    BusinessMeetingComponent,
    SubjectListComponent,
    SharedSubjectListComponent,
    FinishedSubjectListComponent,
    SubjectComponent,
    AddSubjectComponent,
    DiscussionBriefComponent,
    AddProjectComponent,
    SubjectProjectComponent,
    AddStatusComponent,
    StatusCardComponent,
    AddReplyComponent,
    SubjectDiscussionComponent,
    ProjectDiscussionComponent,
    AddCommentComponent,
    ProjectCardBriefComponent,
    SubjectShareComponent,
    ProjectAssignComponent,
    ProjectNextSubjectListComponent,
    ShowMorePipe,
    MoreSharedUserListComponent,
    EditSubjectComponent,
    LocalTimePipe,
    EditProjectComponent,
    MoreProjectOwnerListComponent

  ],
  exports: [
    BusinessMeetingComponent
  ],
  providers: [
    ToasterService,
    DialogService,
    UserService,
    ImageService,
    LoggingUserService,
    BusinessMeetingService,
  ],
})

export class BusinessMeetingModule {
  
}
