import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactRoutingModule } from './contacts-routing.module';
import { AddContactComponent } from './containers/addcontact/addcontact.component';
import { ContactListComponent } from './containers/contactList/contactList.component';
import { ContactDetailsConponent } from './containers/contact-details/contact-details.component';
import { CompanyLogoModule } from 'app/containers/crm/components/company-logo/company-logo.module';
import { ContactsComponent } from './contacts.component';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ContactRoutingModule,
        CompanyLogoModule,
        SpinnerModule,
        AddButtonModule,
        CropModalModule,
        ImageCropperModule,
        ProfilePictureModule,

        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        MatIconModule,
        MatChipsModule,
        MatCardModule,
        MatSelectModule,
        MatButtonModule,
    ],
    declarations:[
        ContactsComponent,
        AddContactComponent,
        ContactListComponent,
        ContactDetailsConponent
    ],
    providers:[

    ],
    exports:[
        ContactListComponent
    ]
})

export class ContactsModule{

}