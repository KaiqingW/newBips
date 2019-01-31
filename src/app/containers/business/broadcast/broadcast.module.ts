import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BroadcastComponent } from './broadcast.component';
import { BroadcastRoutingModule } from './broadcast-routing.module';
import { editEmailComponent } from './editEmial/editemail.component';

import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { SpinnerModule } from 'app/components/spinner/spinner.module';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { BroadcastService } from 'app/core/services/broadcast.service';
import { ShortTextPipe } from './short-text.pipe';

@NgModule({
 imports:[
    CommonModule,
    BroadcastRoutingModule,
    SpinnerModule,
    CompanyLogoModule,
    FormsModule,
    ReactiveFormsModule,

    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule
 ],
 declarations: [
     BroadcastComponent,
     editEmailComponent,
     ShortTextPipe
],
 providers:[
    BroadcastService
 ],
 exports:[
     BroadcastComponent
    ]
})

export class BroadcastModule{

}