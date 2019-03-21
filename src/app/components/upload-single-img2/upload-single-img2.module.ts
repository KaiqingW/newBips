import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from 'app/core/services/inventory.service';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { UploadSingleImg2Component } from './upload-single-img2.component';

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
    UploadSingleImg2Component
  ],
  providers: [InventoryService],
  exports: [
    UploadSingleImg2Component
  ]
})

export class UploadSingleImg2Module {

}
