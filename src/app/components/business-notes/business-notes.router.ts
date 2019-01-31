import { Routes } from '@angular/router';
import { businessSubjectListHeader, addBusinessSubjectHeader, businessSubjecDetailHeader } from 'app/core/models/header';

// components
import { AddNotesSubjectComponent } from 'app/components/business-notes/add-notes-subject/add-notes-subject.component';
import { NotesSubjectsListComponent } from 'app/components/business-notes/notes-subjects-list/notes-subjects-list.component';
import { NotesSubjectDetailComponent } from './notes-subject-detail/notes-subject-detail.component';
import { AddNotesNoteComponent } from './notes-subject-detail/notes-notes-list/add-notes-note/add-notes-note.component';

export const BusinessNotesRoutes: Routes = [

    {
        path: "notesSubject",
        component: NotesSubjectsListComponent,
        data: businessSubjectListHeader
    },
    {
        path: "notesSubject/newNotesSubject",
        component: AddNotesSubjectComponent,
        data: addBusinessSubjectHeader
    },
    {
        path: "notesSubject/notesSubjectDetail/:nsId",
        component: NotesSubjectDetailComponent,
        data: businessSubjecDetailHeader
    },

];
