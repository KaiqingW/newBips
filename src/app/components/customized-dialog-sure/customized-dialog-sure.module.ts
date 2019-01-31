import { NgModule } from '@angular/core';
import { CustomizedDialogSureComponent } from './customized-dialog-sure.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    CustomizedDialogSureComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    CustomizedDialogSureComponent
  ],
  entryComponents: [
    CustomizedDialogSureComponent
  ]
})

export class CustomizedDialogSureModule {

}
