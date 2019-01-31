import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/core/shared/shared.module';

import { BusinessQuotaRoutingModule } from './business-quota-routing.module';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { BusinessQuotaComponnet } from './business-quota.component';
import { AddQuoteComponent } from './add-quote/add-quote.component';
import { QuoteDetailsComponent } from './quote-details/quote-details.component';
import { EditSalesentityComponent } from './edit-salesentity/edit-salesentity.component';

import { SignaturePadModule } from 'angular2-signaturepad';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { ProgressBarModule } from 'app/containers/crm/components/progress-bar/progress-bar.module';
import { DayLeftbarModule } from 'app/containers/crm/components/day-left-bar/day-left-bar.module';

import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { ShortTextPipe } from './short-text.pipe';
import { MatTableModule } from '@angular/material/table';
import { BusinessNotesModule } from 'app/components/business-notes/business-notes.module';

import { QuoteService } from 'app/core/services/quote.service';
import { ImageService } from 'app/core/services/image.service';
import { VrmBaBaService } from 'app/containers/vrm/vrm.service';
import { SearchService } from 'app/core/services/search.service';
import { SharedService } from 'app/core/services/shared.service';
@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        BusinessQuotaRoutingModule,
        ProgressBarModule,
        DayLeftbarModule,
        CompanyLogoModule,
        SignaturePadModule,
        SpinnerModule,
        MatCardModule,
        AddButtonModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTableModule,
        BusinessNotesModule,
        
    ],
    declarations:[
        BusinessQuotaComponnet,
        AddQuoteComponent,
        QuoteDetailsComponent,
        EditSalesentityComponent,
        ShortTextPipe
    ],
    exports:[
        BusinessQuotaComponnet
    ],
    providers:[
        QuoteService,
        ImageService,
        VrmBaBaService,
        SearchService,
        SharedService
    ]
        
})

export class BusinessQuotasModule{

}