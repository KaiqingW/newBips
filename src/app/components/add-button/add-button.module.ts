import { NgModule } from '@angular/core';
import { AddButtonComponent } from './add-button.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AddButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    AddButtonComponent
  ]
})

export class AddButtonModule {

}
