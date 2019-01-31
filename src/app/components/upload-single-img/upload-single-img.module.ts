import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from 'app/core/services/inventory.service';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { UploadSingleImgComponent } from './upload-single-img.component';
import { MatCardModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ImgModalModule,
    MatCardModule,
    MatButtonModule
  ],
  declarations: [
    UploadSingleImgComponent
  ],
  providers: [InventoryService],
  exports: [
    UploadSingleImgComponent
  ]
})

export class UploadSingleImgModule {

}
