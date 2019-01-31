import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OpportunityComponent } from './opportunity.component';
import { OpportunityRoutingModule } from './opportunity-routing.module';
import { OpportunityDetailComponent } from './containers/opportunity-detail/opportunity-detail.component';
import { AddOpportunityComponent } from './containers/add-opportunity/add-opportunity.component';
import { RequestPriceModule } from './components/request-price/request-price.module';
import { RequestInfoModule } from './components/request-info/request-info.module';
// import { RequestInfoComponent } from './components/request-info/request-info.component';
// import { RequestPriceComponent } from './components/request-price/request-price.component';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { UploadImgModule } from 'app/components/upload-img/upload-img.module';

import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { OpportunityService } from 'app/core/services/opportunity.service';

@NgModule({
    imports:[
        CommonModule,
        OpportunityRoutingModule,
        AddButtonModule,
        FormsModule,
        ReactiveFormsModule,
        SpinnerModule,
        RequestPriceModule,
        RequestInfoModule,
        UploadImgModule,

        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule

    ],
    declarations:[
        OpportunityComponent,
        OpportunityDetailComponent,
        AddOpportunityComponent,

    ],
    exports:[
        OpportunityComponent
    ],
    providers:[

    ]
})


export class OpportunityModule {

}