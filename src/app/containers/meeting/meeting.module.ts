import { NgModule } from '@angular/core';
import { MeetingComponent } from './meeting.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeetingRoutes } from './meeting.router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { EditorModule } from 'app/components/editor/editor.module';
import { MatMenuModule } from '@angular/material/menu';
import { MeetingService } from 'app/core/services/meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { DialogService } from 'app/core/services/dialog.service';
import { UserService } from 'app/core/services/user.service';
import { LoggingUserService} from 'app/core/services/logging-user.service';
import { ImageService } from 'app/core/services/image.service';
import { OmitNamePipe, OmitNameImpurePipe } from './name-ellipsis.pipe';
import { LocalTimePipe } from './local-time.pipe';
import { ShowMorePipe } from './show-more.pipe';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { SubjectListSharedComponent } from './components/subject-list-shared/subject-list-shared.component';
import { SubjectComponent } from './components/subject/subject.component';
import { ReadMoreComponent } from './components/subject/read-more/read-more.component';
import { AddNoteComponent } from './components/add-note/add-note.component';
import { AddSubjectComponent } from './components/add-subject/add-subject.component';
import { AttchmentModule } from 'app/components/attachment/attachment.module';

import { AddCommentComponent } from './components/add-comment/add-comment.component';

import { ProgressBarModule } from "app/containers/crm/components/progress-bar/progress-bar.module";
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { SubjectNoteComponent } from './components/subject-note/subject-note.compontent';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { ShareComponent } from './components/share/share.component';
import { MomentModule } from 'angular2-moment/moment.module';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';
// import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssignNoteComponent } from './components/assign-note/assign-note.component';
import { DeadlineBarModule } from './commons/deadline-bar/deadline-bar.module';
import { ProjectDiscussionComponent } from './components/project-discussion/project-discussion.component';
import { AddReplyComponent } from './components/add-reply/add-reply.component'; // <-- import required BrowserAnimationsModule

@NgModule({
  imports: [
    RouterModule.forChild(MeetingRoutes),
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
    ProfilePictureModule,
    CompanyLogoModule,
    ProgressBarModule,
    DeadlineBarModule,
    AttchmentModule,
    MatCheckboxModule,
    // BrowserModule,
    // BrowserAnimationsModule,  // <-- include required BrowserAnimationsModule
  ],
  declarations: [
    MeetingComponent,
    SubjectListSharedComponent,
    SubjectListComponent,
    OmitNamePipe,
    OmitNameImpurePipe,
    SubjectComponent,
    ReadMoreComponent,
    AddNoteComponent,
    AddSubjectComponent,
    ShareComponent,
    LocalTimePipe,
    ShowMorePipe,
    SubjectNoteComponent,
    AddCommentComponent,
    AssignNoteComponent,
    ProjectDiscussionComponent,
    AddReplyComponent
  ],
  exports: [
    MeetingComponent
  ],
  providers: [
    MeetingService,
    ToasterService,
    DialogService,
    UserService,
    ImageService,
    LoggingUserService
  ],
})

export class MeetingModule {}
