import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImageCropperModule } from 'ng2-img-cropper';
import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';

import { CommonImageCropperComponent } from './image-cropper.component';
import { ImageService } from 'app/core/services/image.service';
import { InventoryService } from 'app/core/services/inventory.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
    declarations:[
        CommonImageCropperComponent
    ],
    imports:[
        CommonModule,
        ImageCropperModule,
        FormsModule,
        ReactiveFormsModule,
        CropModalModule,
        MatButtonModule,
        MatIconModule
    ],
    exports:[
        CommonImageCropperComponent
    ],
    providers:[
        ImageService,
        InventoryService
    ],
})

export class CommonImageCropperModule{

}

