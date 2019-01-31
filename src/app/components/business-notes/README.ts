// How to use business-notes module in your component

// 1: import BusinessNotesModuleimport { templateJitUrl } from "@angular/compiler";
//  in your module file

// for example:
// import { BusinessNotesModule } from 'app/components/business-notes/business-notes.module';

// 2: define correct path in your router File

// for example:

// // route to BusinessNotesModule
// {
//     path: 'orders/:oId/item/:iId/notesSubject',
//     loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
//     data: businessSubjectListHeader
// },

// // route to AddNotesSubjectComponent
// {
//     path: "orders/:oId/item/:iId/notesSubject/newNotesSubject",
//     component: AddNotesSubjectComponent,
//     data: addBusinessSubjectHeader
// },

// // route to NotesSubjectDetailComponent
// {
//     path: "orders/:oId/item/:iId/notesSubject/:nsId",
//     component: NotesSubjectDetailComponent,
//     data: businessSubjecDetailHeader
// },

// 3: add routerLink in your template

// for example:
// routerLink="notesSubject"

// In the future, if a new component needs to use BusinessNotesModule, 
// the url of the new component must include a unique id (like cusis, iId).

// BusinessNotesModule needs to get data from server based on these unique id.
