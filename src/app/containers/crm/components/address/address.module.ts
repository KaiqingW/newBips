import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AddressComponent } from './address.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { AddressRoutingModule } from './address-routing.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';

import { LeadService } from 'app/core/services/lead.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AddressRoutingModule,
        SpinnerModule,
        AddButtonModule,

        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatSelectModule
    ],
    declarations:[
        AddressComponent,
        AddAddressComponent,
        EditAddressComponent
    ],
    providers:[
        LeadService
    ]
})

export class AddressModule{

}