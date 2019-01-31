import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';

import { CompanyDetailComponent } from "./company-detail-page.component";

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// import { MatSelectModule } from '@angular/material/select';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatFormFieldModule } from '@angular/material/form-field';

import { PanelCardModule } from "app/containers/crm/components/panel-card/panel-card.module";
import { CompanyLogoModule } from 'app/containers/crm/components/company-logo/company-logo.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        PanelCardModule,
        MatCardModule,
        MatIconModule,
        CompanyLogoModule,
        SpinnerModule,
        RouterModule,
        // MatSelectModule,
        // MatAutocompleteModule,
        // MatFormFieldModule
    ],
    declarations:[
        CompanyDetailComponent
    ],
    exports:[
        CompanyDetailComponent
    ],
    providers:[

    ]
})

export class CompanyDetailPageModule{

}
