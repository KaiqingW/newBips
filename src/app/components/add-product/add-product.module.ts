import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AddProductComponent } from './add-product.component';
import { InventoryService } from '../../core/services/inventory.service';
import { CommonService } from 'app/core/services/common.service';
import { LeadService } from 'app/core/services/lead.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ShortTextPipe } from './short-text.pipe';

@NgModule({
    declarations:[
        AddProductComponent,
        ShortTextPipe
    ],
    imports :[
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatAutocompleteModule,

    ],
    exports:[
        AddProductComponent
    ],
    providers:[
        InventoryService,
        CommonService,
        LeadService
    ],
    entryComponents:[
        AddProductComponent
    ]
})

export class AddProductModule{
    
}
