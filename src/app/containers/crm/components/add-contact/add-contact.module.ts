import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddContactComponent } from "./add-contact.component";

import { MatInputModule } from '@angular/material/input';
import { ContactService } from 'app/core/services/contact.service';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { MatSelectModule } from '@angular/material/select';
import { ImageCropperModule } from 'ng2-img-cropper';
import { MatButtonModule } from '@angular/material/button';

import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        SpinnerModule,
        MatAutocompleteModule,
        MatSelectModule,
        ImageCropperModule,
        CropModalModule,
        MatButtonModule
    ],
    declarations:[
        AddContactComponent
    ],
    exports:[
        AddContactComponent
    ],
    providers:[
        ContactService
    ]
})

export class AddContactModule{

}
