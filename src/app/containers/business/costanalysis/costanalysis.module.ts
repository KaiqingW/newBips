import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CostAnalysisRoutingModule } from "./costanalysis-routing.module";
import { AddButtonModule } from "app/components/add-button/add-button.module";
import { SpinnerModule } from "app/components/spinner/spinner.module";
import { CostAnalysisService } from 'app/core/services/cost-analysis.service';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";

import { CostAnalysisComponent } from "./costanalysis.component";
import { AddCostAnalysisComponent } from "./containers/add-costanalysis/add-costanalysis.component";
import { CostAnalysisDetailsComponent } from "./containers/costanalysisdetails/costanalysisdetails.component";
import { CostAnlaysisListComponent } from "./containers/costanalysislist/costanalysislist.component";

import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { ShortTextPipe } from './short-text.pipe';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CostAnalysisRoutingModule,
        AddButtonModule,
        SpinnerModule,
        CompanyLogoModule,

        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule


    ],
    declarations: [
        CostAnalysisComponent,
        AddCostAnalysisComponent,
        CostAnalysisDetailsComponent,
        CostAnlaysisListComponent,
        ShortTextPipe

    ],
    providers:[
        CostAnalysisService,
    ],
    exports:[
        CostAnalysisComponent
    ]
})

export class CostAnalysisModule{

}