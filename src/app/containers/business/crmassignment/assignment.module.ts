import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { CrmAssignmentRoutingModule } from './assignment-routing.module';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatSelectModule } from '@angular/material/select';
import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';

import { CrmAssignmentComponent } from './assignment.component';
import { CustomerListComponent } from './containers/customer-list/customer-list.component';
import { CommonService } from 'app/core/services/common.service';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        CrmAssignmentRoutingModule,
        ReactiveFormsModule,
        SpinnerModule,
        CompanyLogoModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatCheckboxModule
    ],
    declarations:[
        CrmAssignmentComponent,
        CustomerListComponent
    ],

    exports:[
        CrmAssignmentComponent
    ],
    providers:[
        CrmAssignmentService,
        CommonService
    ]
    
    
})

export class CrmAssignmentModule{

}

