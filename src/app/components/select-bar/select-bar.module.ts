import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectBarComponent } from './select-bar.component';


@NgModule({
  declarations: [
    SelectBarComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SelectBarComponent
  ]
})

export class SelectBarModule {

}
