import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VendorProductsComponent } from './vendor-products.component';
import { PanelCardModule } from "app/containers/crm/components/panel-card/panel-card.module";

import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
    imports:[
        CommonModule,
        PanelCardModule,
        MatIconModule,
        MatCardModule,
        RouterModule,
        SpinnerModule
    ],
    declarations:[
        VendorProductsComponent
    ],
    providers:[

    ],
    exports:[
        VendorProductsComponent
    ]
})

export class VendorProductModule {

}