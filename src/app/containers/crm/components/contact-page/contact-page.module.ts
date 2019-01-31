import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';
import { AvatarModule } from 'app/components/avatar/avatar.module';
import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';
import { ImageCropperModule } from 'ng2-img-cropper';
import { SpinnerModule } from 'app/components/spinner/spinner.module';

import { ContactPageComponent } from './contact-page.component';
@NgModule({
    imports:[
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ProfilePictureModule,
        AvatarModule,
        CropModalModule,
        ImageCropperModule,

        MatCardModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        SpinnerModule
    ],
    declarations:[
        ContactPageComponent
    ],
    exports:[
        ContactPageComponent
    ],
    providers:[

    ]
})

export class ContactPageModule{}
