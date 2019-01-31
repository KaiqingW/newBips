import { Routes } from '@angular/router';
import { NotesComponent } from './notes.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { SubjectListSharedComponent } from './components/subject-list-shared/subject-list-shared.component';
import { SubjectComponent } from './components/subject/subject.component';
import { AddNoteComponent } from './components/add-note/add-note.component';
import { AddSubjectComponent } from './components/add-subject/add-subject.component';
import { ShareComponent } from './components/share/share.component';
import { SubjectNoteComponent } from './components/subject-note/subject-note.compontent';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { companySubjectListHeader, shareHeader, subjectListHeader, subjectHeader,addSubjectHeader, addNoteHeader,noteHeader,commentHeader } from 'app/core/models/header';

export const NotesRoutes: Routes = [
    {
        path: 'notes',
        component: NotesComponent,
        children: [
            {
                path: '',
                redirectTo: '/notes/subject',
                pathMatch: 'full'
            },
            {
                path: 'subject',
                component: SubjectListComponent,
                data: subjectListHeader
            },
            {
                path: 'subject_shared',
                component: SubjectListSharedComponent,
                data: subjectListHeader
            },
            {
                path: 'subject_shared/:notesSubId',
                component: SubjectComponent,
                data: subjectHeader
            },
            {
                path: 'subject/:notesSubId',
                component: SubjectComponent,
                data: subjectHeader
            },
            {
                path: 'create',
                component: AddSubjectComponent,
                data: addSubjectHeader
            },
            {
                path: 'subject/:notesSubId/create/:notesSubId',
                component: AddNoteComponent,
                data: addNoteHeader
            },
            {
                path: 'subject_shared/:notesSubId/create/:notesSubId',
                component: AddNoteComponent,
                data: addNoteHeader
            },
            {
                path: 'subject/:notesSubId/share',
                component: ShareComponent,
                data: shareHeader
            },
            {
                path: 'subject_shared/:notesSubId/share',
                component: ShareComponent,
                data: shareHeader
            },
            {
                path: 'subject/:notesSubId/note/:notesNoteId',
                component: SubjectNoteComponent,
                data: noteHeader
            },
            {
                path: 'subject_shared/:notesSubId/note/:notesNoteId',
                component: SubjectNoteComponent,
                data: noteHeader
            },
            {
                path: 'subject/:notesSubId/note/:notesNoteId/comment/create/:notesNoteId',
                component: AddCommentComponent,
                data: commentHeader
            },
            {
                path: 'subject/:notesSubId/note/:notesNoteId/comment/reply/:notesComId',
                component: AddCommentComponent,
                data: commentHeader
            },
            {
                path: 'subject_shared/:notesSubId/note/:notesNoteId/comment/create/:notesNoteId',
                component: AddCommentComponent,
                data: commentHeader
            },
            {
                path: 'subject_shared/:notesSubId/note/:notesNoteId/comment/reply/:notesComId',
                component: AddCommentComponent,
                data: commentHeader
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
