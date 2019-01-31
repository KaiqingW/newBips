import { NgModule } from '@angular/core';
import { CropModalComponent } from './crop-modal.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    CropModalComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    CropModalComponent
  ]
})

export class CropModalModule {

}
