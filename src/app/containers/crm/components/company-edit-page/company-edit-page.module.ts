import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CompanyEditPageComponent } from "./company-edit-page.component";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';

import { PanelCardModule } from "../panel-card/panel-card.module";
import { CompanyLogoModule } from '../company-logo/company-logo.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { AvatarModule } from 'app/components/avatar/avatar.module';
import { ImageCropperModule } from 'ng2-img-cropper';
import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';

import { ToasterService } from 'app/core/services/toaster.service';
import { ImageService } from 'app/core/services/image.service';
import { LeadService } from 'app/core/services/lead.service';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        PanelCardModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatChipsModule,
        
        CompanyLogoModule,
        SpinnerModule,
        ReactiveFormsModule,
        AvatarModule,
        ImageCropperModule,
        CropModalModule,
        NgxMaskModule
    ],
    declarations:[
        CompanyEditPageComponent
    ],
    exports:[
        CompanyEditPageComponent
    ],
    providers:[
        ToasterService,
        ImageService,
        LeadService
    ]
})

export class CompanyEditPageModule{

}

