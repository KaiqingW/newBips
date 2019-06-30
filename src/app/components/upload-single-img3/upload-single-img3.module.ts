import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from 'app/core/services/inventory.service';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { UploadSingleImg3Component } from './upload-single-img3.component';

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
    UploadSingleImg3Component
  ],
  providers: [InventoryService],
  exports: [
    UploadSingleImg3Component
  ]
})

export class UploadSingleImg3Module {

}
