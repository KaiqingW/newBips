import { NgModule } from '@angular/core';
import { ImgModalComponent } from './img-modal.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ImgModalComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    ImgModalComponent
  ]
})

export class ImgModalModule {

}
