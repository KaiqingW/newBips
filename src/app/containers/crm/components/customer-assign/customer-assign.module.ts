import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerAssignComponent } from './customer-assign.component';
import { SpinnerModule } from 'app/components/spinner/spinner.module';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';
import { NotesService } from 'app/core/services/notes.service';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SpinnerModule,

        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCheckboxModule
    ],
    declarations:[
        CustomerAssignComponent
    ],
    exports:[
        CustomerAssignComponent
    ],
    providers:[
        CrmAssignmentService,
        NotesService
    ]
})

export class CustomerAssignModule{

}

