import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestInfoComponent } from './request-info.component';

import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { OpportunityService } from 'app/core/services/opportunity.service';
import { SpinnerModule } from 'app/components/spinner/spinner.module';


@NgModule({
    imports:[
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        SpinnerModule
    ],
    declarations:[
        RequestInfoComponent
    ],
    exports:[
        RequestInfoComponent
    ],
    providers:[
        OpportunityService
    ]
})

export class RequestInfoModule{

}