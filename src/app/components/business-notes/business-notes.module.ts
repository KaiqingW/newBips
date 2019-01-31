import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/core/shared/shared.module';

import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// pipes
// used for add-shipped
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { MomentModule } from 'angular2-moment/moment.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageUploadModule } from "angular2-image-upload";
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { LogoModule } from 'app/components/logo/logo.module';

// services
import { OrdersService } from "app/core/services/orders.service";
import { BusinessNotesService } from 'app/core/services/business-notes.service';
import { QuoteService } from 'app/core/services/quote.service';
import { SharedService } from 'app/core/services/shared.service';

// components
import { BusinessNotesComponent } from 'app/components/business-notes/business-notes.component';
import { AddNotesSubjectComponent } from 'app/components/business-notes/add-notes-subject/add-notes-subject.component';
import { NotesSubjectsListComponent } from './notes-subjects-list/notes-subjects-list.component';
import { NotesSubjectDetailComponent } from './notes-subject-detail/notes-subject-detail.component';
import { LocalTimePipe } from './local-time.pipe';
import { ShortTextPipe } from './short-text.pipe';

//router
import { BusinessNotesRoutes } from './business-notes.router';
import { NotesNotesListComponent } from './notes-subject-detail/notes-notes-list/notes-notes-list.component';
import { AddNotesNoteComponent } from './notes-subject-detail/notes-notes-list/add-notes-note/add-notes-note.component';
import { ReadMoreModule } from 'app/containers/business-meeting/components/read-more/read-more.module';
import { MatChipsModule } from '@angular/material';


// //Components
// import { HousesComponent } from './houses/houses.component';
// import { AddWarehouseComponent} from './houses/add-warehouse/add-warehouse.component';

// //services
// import { WarehouseService } from 'app/core/services/warehouse.service';


@NgModule({
  imports: [
    // forChild is used for child component, like inventory.component
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerModule,
    MomentModule,
    MatDialogModule,
    MatFormFieldModule,
    ImageUploadModule,
    ImgModalModule,
    AddButtonModule,
    // router
    RouterModule.forChild(BusinessNotesRoutes),
    LogoModule,
    ReadMoreModule,
    SharedModule,
    MatChipsModule
  ],
  declarations: [
    BusinessNotesComponent,
    AddNotesSubjectComponent,
    NotesSubjectsListComponent,
    NotesSubjectDetailComponent,
    NotesNotesListComponent,
    AddNotesNoteComponent,
    LocalTimePipe,
    ShortTextPipe

    // WarehouseComponent,
    // HousesComponent,
    // AddWarehouseComponent
  ],

  entryComponents: [AddNotesNoteComponent],
  providers: [
    OrdersService,
    DatePipe,
    BusinessNotesService,
    QuoteService,
    SharedService
  ],
  exports: [
    BusinessNotesComponent,

  ]
    
})
export class BusinessNotesModule {
  // constructor(private sharedService: SharedService){

  // }
}
