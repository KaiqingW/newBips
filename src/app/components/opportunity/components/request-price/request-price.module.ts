import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestPriceComponent } from './request-price.component';

import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    imports:[
        CommonModule,
        MatCardModule
    ],
    declarations:[
        RequestPriceComponent
    ],
    exports:[
        RequestPriceComponent
    ],
    providers:[

    ]

})

export class RequestPriceModule{

}