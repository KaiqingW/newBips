import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StatusDetailsComponent } from './status-details.component';
import { OpportunityService } from 'app/core/services/opportunity.service';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { SubjectContentModule } from '../status-content/status-content.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

import { StatusCardModule } from 'app/containers/business/opportunity/components/status-card/status-card.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
@NgModule({
    imports:[
        CommonModule,
        SpinnerModule,
        MatCardModule,
        StatusCardModule,
        AddButtonModule,
        RouterModule,
        SubjectContentModule
    ],
    declarations:[
        StatusDetailsComponent
    ],
    exports:[
        StatusDetailsComponent
    ],
    providers:[
        OpportunityService
    ]
})

export class StatusDetailsModule{

}