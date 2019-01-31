import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from 'app/core/services/inventory.service';

import { UploadImgComponent } from './upload-img.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { CommonImageCropperModule } from '../image-cropper/image-cropper.module';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ImgModalModule,
    CommonImageCropperModule
  ],
  declarations: [
    UploadImgComponent
  ],
  providers: [InventoryService],
  exports: [
    UploadImgComponent
  ]
})

export class UploadImgModule {

}
