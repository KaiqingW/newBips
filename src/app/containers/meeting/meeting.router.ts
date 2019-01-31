import { Routes } from '@angular/router';
import { MeetingComponent } from './meeting.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { SubjectListSharedComponent } from './components/subject-list-shared/subject-list-shared.component';
import { SubjectComponent } from './components/subject/subject.component';
import { AddNoteComponent } from './components/add-note/add-note.component';
import { AddSubjectComponent } from './components/add-subject/add-subject.component';
import { ShareComponent } from './components/share/share.component';
import { SubjectNoteComponent } from './components/subject-note/subject-note.compontent';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { AssignNoteComponent } from './components/assign-note/assign-note.component';
import { ProjectDiscussionComponent } from './components/project-discussion/project-discussion.component'; // <-- import required BrowserAnimationsModule
import { AddReplyComponent } from './components/add-reply/add-reply.component'; // <-- import required BrowserAnimationsModule
import { commentReplyHeader, meetingNoteDiscussionHeader, addProjectHeader, assignHeader, meetingNoteHeader, meetingSubjectHeader, meetingListHeader, companySubjectListHeader, shareHeader, subjectListHeader, subjectHeader,addSubjectHeader, addNoteHeader,noteHeader,commentHeader } from 'app/core/models/header';

export const MeetingRoutes: Routes = [
    {
        path: 'meeting',
        component: MeetingComponent,
        children: [
            {
                path: '',
                redirectTo: '/meeting/subject',
                pathMatch: 'full'
            },
            {
                path: 'subject',
                component: SubjectListComponent,
                data: meetingListHeader
            },
            {
                path: 'subject_shared',
                component: SubjectListSharedComponent,
                data: meetingListHeader
            },
            {
                path: 'subject_shared/:subId',
                component: SubjectComponent,
                data: meetingSubjectHeader
            },
            {
                path: 'subject/:subId',
                component: SubjectComponent,
                data: meetingSubjectHeader
            },
            {
                path: 'create',
                component: AddSubjectComponent,
                data: addSubjectHeader
            },
            {
                path: 'subject/:subId/create/:subId',
                component: AddNoteComponent,
                data: addProjectHeader
            },
            {
                path: 'subject_shared/:subId/create/:subId',
                component: AddNoteComponent,
                data: addProjectHeader
            },
            {
                path: 'subject/:subId/share',
                component: ShareComponent,
                data: shareHeader
            },
            {
                path: 'subject/:subId/assignNote',
                component: AssignNoteComponent,
                data: assignHeader
            },
            {
                path: 'subject_shared/:subId/share',
                component: ShareComponent,
                data: shareHeader
            },
            {
                path: 'subject/:subId/note/:noteId',
                component: SubjectNoteComponent,
                data: meetingNoteHeader
            },
            {
                path: 'subject/:subId/note/:noteId/discussion',
                component: ProjectDiscussionComponent,
                data: meetingNoteDiscussionHeader
            },
            {
                path: 'subject_shared/:subId/note/:noteId',
                component: SubjectNoteComponent,
                data: meetingNoteHeader
            },
            {
                path: 'subject_shared/:subId/note/:noteId/discussion',
                component: ProjectDiscussionComponent,
                data: meetingNoteDiscussionHeader
            },
            {
                path: 'subject/:subId/note/:noteId/comment/create/:noteId',
                component: AddCommentComponent,
                data: commentHeader
            },
            {
                path: 'subject/:subId/note/:noteId/comment/reply/:comId',
                component: AddReplyComponent,
                data: commentReplyHeader
            },
            {
                path: 'subject_shared/:subId/note/:noteId/comment/create/:noteId',
                component: AddCommentComponent,
                data: commentHeader
            },
            {
                path: 'subject_shared/:subId/note/:noteId/comment/reply/:comId',
                component: AddReplyComponent,
                data: commentReplyHeader
            }

        ]
    },
    // {
    //     path: 'companyNotes',
    //     component: NotesComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: '/companyNotes/subject',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: 'subject',
    //             component: SubjectListComponent,
    //             data: companySubjectListHeader
    //         },
    //         {
    //             path: 'subject_shared',
    //             component: SubjectListSharedComponent,
    //             data: subjectListHeader
    //         },
    //         {
    //             path: 'subject_shared/:id',
    //             component: SubjectComponent,
    //             data: subjectHeader
    //         },
    //         {
    //             path: 'subject/:id',
    //             component: SubjectComponent,
    //             data: subjectHeader
    //         },
    //         {
    //             path: 'create',
    //             component: AddSubjectComponent,
    //             data: addSubjectHeader
    //         },
    //         {
    //             path: 'create/:id',
    //             component: AddNoteComponent,
    //             data: addNoteHeader
    //         },
    //         {
    //             path: 'subject/:id/share',
    //             component: ShareComponent,
    //             data: shareHeader
    //         },
    //         {
    //             path: 'subject/note/:id',
    //             component: SubjectNoteComponent,
    //             data: noteHeader
    //         },
    //         {
    //             path: 'subject/note/comment/create/:id',
    //             component: AddCommentComponent,
    //             data: commentHeader
    //         },
    //         {
    //             path: 'subject/note/comment/reply/:id',
    //             component: AddCommentComponent,
    //             data: commentHeader
    //         }

    //     ]
    // }
];
