import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WideSelectBarComponent } from './wide-select-bar.component';


@NgModule({
  declarations: [
    WideSelectBarComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    WideSelectBarComponent
  ]
})

export class WideSelectBarModule {

}
