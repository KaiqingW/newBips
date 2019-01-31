import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddCrmOpportunityComponent } from './add-crm-opportunity.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service'
import { CommonService } from 'app/core/services/common.service';
import { ShortTextPipe } from './short-text.pipe';

@NgModule({
    imports :[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatAutocompleteModule
    ],
    declarations:[
        AddCrmOpportunityComponent,
        ShortTextPipe
    ],
    providers:[
        DepartmentOpportunityService,
        CommonService
    ],
    exports:[
        AddCrmOpportunityComponent
    ],
    entryComponents:[
        AddCrmOpportunityComponent
    ]
})

export class AddCrmOpportunityModule{

}