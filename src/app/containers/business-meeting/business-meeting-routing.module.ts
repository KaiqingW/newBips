import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { BusinessMeetingComponent } from './business-meeting.component';
// subject-list
import { SubjectListComponent } from './containers//subject-list/subject-list.component';
import { SubjectComponent } from './containers/subject-list/subject/subject.component';
import { AddSubjectComponent } from './containers/subject-list/add-subject/add-subject.component';
import { AddProjectComponent } from './containers/add-project/add-project.component';
import { SubjectProjectComponent } from './containers/subject-project/subject-project.component';
import { AddStatusComponent } from './containers/subject-project/add-status/add-status.component';
import { AddReplyComponent } from './containers/subject-project/add-reply/add-reply.component';
import { SubjectDiscussionComponent } from './containers/subject-discussion/subject-discussion.component';
import { AddCommentComponent } from './containers/add-comment/add-comment.component';
import { ProjectDiscussionComponent } from './containers/project-discussion/project-discussion.component';
import { SubjectShareComponent } from './containers/subject-share/subject-share.component';
import { ProjectAssignComponent } from './containers/project-assign/project-assign.component';
import { MoreSharedUserListComponent } from './containers/more-shared-user-list/more-shared-user-list.component';
import { EditSubjectComponent } from './containers/subject-list/edit-subject/edit-subject.component';
import { EditProjectComponent } from './containers/subject-project/edit-project/edit-project.component';
import { MoreProjectOwnerListComponent } from './containers/more-project-owner-list/more-project-owner-list.component';

// shared-subject-list
import { SharedSubjectListComponent } from './containers/shared-subject-list/shared-subject-list.component';
// finished-subject-list
import { FinishedSubjectListComponent } from './containers/finished-subject-list/finished-subject-list.component';
// next-subject-list
import { ProjectNextSubjectListComponent } from './containers/project-next-subject-list/project-next-subject-list.component';

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
    addSubjectHeader, 
    addProjectHeader, 
    addStatusHeader,
    addReplyHeader,
    subjectDiscussionHeader,
    projectDiscussionHeader,
    commentHeader,
    subjectShareHeader, 
    assignHeader, 
    nextBusinessMeetingSubjectHeader,
    addNextSubjectHeader,
    projectAssignHeader,
    moreSharedUserHeader,
    editSubjectHeader,
    editProjectHeader,
    ownerListHeader
    
} from 'app/core/models/header';

const businessMeetingRoutes: Routes = [
    // {
    //     path: 'meeting',
    //     component: BusinessMeetingComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: '/meeting/subject',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: 'subject',
    //             component: SubjectListComponent,
    //             data: meetingListHeader
    //         },
    //     ]
    // },

    // subject routes
    {
        path: 'subject',
        component: SubjectListComponent,
        data: meetingListHeader
    },
    // my subject, next meeting subject, and previous meeting subject use the same url
    {
        path: 'subject/:subjectId',
        component: SubjectComponent,
        data: businessMeetingSubjectHeader
    },
    {
        path: 'subject/:subjectId/edit-subject',
        component: EditSubjectComponent,
        data: editSubjectHeader
    },
    {
        path: 'subject/:subjectId/all-shared-user',
        component: MoreSharedUserListComponent,
        data: moreSharedUserHeader
    },
    {
        path: 'subject/:subjectId/discussion',
        component: SubjectDiscussionComponent,
        data: subjectDiscussionHeader
    },
    {
        path: 'add-subject',
        component: AddSubjectComponent,
        data: addSubjectHeader
    },
    {
        path: 'subject/:subjectId/project/:projectId',
        component: SubjectProjectComponent,
        data: businessMeetingProjectHeader
    },
    // more project owners
    {
        path: 'subject/:subjectId/project/:projectId/all-project-owner',
        component: MoreProjectOwnerListComponent,
        data: ownerListHeader
    },
    {
        path: 'subject/:subjectId/project/:projectId/edit-project',
        component: EditProjectComponent,
        data: editProjectHeader
    },
    {
        path: 'subject/:subjectId/project/:projectId/discussion',
        component: ProjectDiscussionComponent,
        data: meetingNoteDiscussionHeader
    },
    {
        path: 'subject/:subjectId/project/:projectId/discussion/add-comment',
        component: AddCommentComponent,
        data: commentHeader
    },
    {
        path: 'subject/:subjectId/discussion/comment/:statusId/add-reply',
        component: AddReplyComponent,
        data: addReplyHeader
    },
    {
        path: 'subject/:subjectId/project/:projectId/discussion/comment/:statusId/add-reply',
        component: AddReplyComponent,
        data: addReplyHeader
    },
    {
        path: 'subject/:subjectId/add-project',
        component: AddProjectComponent,
        data: addProjectHeader
    },
    {
        path: 'subject/:subjectId/project/:projectId/add-status',
        component: AddStatusComponent,
        data: addStatusHeader
    },
    {
        path: 'subject/:subjectId/discussion/:projectId/add-comment',
        component: AddCommentComponent,
        data: commentHeader
    },
    {
        path: 'subject/:subjectId/project/:projectId/status/:statusId/add-reply',
        component: AddReplyComponent,
        data: addReplyHeader
    },
    {
        path: 'subject/:subjectId/share',
        component: SubjectShareComponent,
        data: subjectShareHeader
    },
    {
        path: 'subject/:subjectId/share',
        component: SubjectShareComponent,
        data: subjectShareHeader
    },
    {
        path: 'subject/:subjectId/project/:projectId/assign-owner',
        component: ProjectAssignComponent,
        data: projectAssignHeader
    },
    // the owner of the project generate next new meeting, which is add subject
    {
        path: 'subject/project/:prevProjectId/generate-new-meeting-subject',
        component: AddSubjectComponent,
        data: addNextSubjectHeader
    },

    // next-meeting subjects routes
    {
        path: 'project/:projectId/next-subject',
        component: ProjectNextSubjectListComponent,
        data: nextBusinessMeetingSubjectHeader
    },

    // shared-subject routes
    {
        path: 'shared-subject',
        component: SharedSubjectListComponent,
        data: meetingListHeader
    },
    // {
    //     path: 'shared-subject/:subjectId',
    //     component: SubjectComponent,
    //     data: businessMeetingSubjectHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/discussion',
    //     component: SubjectDiscussionComponent,
    //     data: subjectDiscussionHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/project/:projectId',
    //     component: SubjectProjectComponent,
    //     data: businessMeetingProjectHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/project/:projectId/discussion',
    //     component: ProjectDiscussionComponent,
    //     data: meetingNoteDiscussionHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/project/:projectId/discussion/add-comment',
    //     component: AddCommentComponent,
    //     data: commentHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/discussion/comment/:statusId/add-reply',
    //     component: AddReplyComponent,
    //     data: addReplyHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/project/:projectId/discussion/comment/:statusId/add-reply',
    //     component: AddReplyComponent,
    //     data: addReplyHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/project/:projectId/add-status',
    //     component: AddStatusComponent,
    //     data: addStatusHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/discussion/:projectId/add-comment',
    //     component: AddCommentComponent,
    //     data: commentHeader
    // },
    // {
    //     path: 'shared-subject/:subjectId/project/:projectId/status/:statusId/add-reply',
    //     component: AddReplyComponent,
    //     data: addReplyHeader
    // },
    // // the owner of the project generate next new meeting, which is add subject
    // {
    //     path: 'shared-subject/project/:prevProjectId/generate-new-meeting-subject',
    //     component: AddSubjectComponent,
    //     data: addSubjectHeader
    // },

    // complete
    {
        path: 'finished-subject',
        component: FinishedSubjectListComponent,
        data: meetingListHeader
    },

    // send-email-message route
    {
        path: 'send-email-message',
        loadChildren: 'app/components/send-email-message/send-email-message.module#SendEmailMessageModule',
    },
];

@NgModule({
    imports:[
        RouterModule.forChild(businessMeetingRoutes),
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class BusinessMeetingRoutingModule{

}
