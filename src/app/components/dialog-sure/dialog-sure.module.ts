import { NgModule } from '@angular/core';
import { DialogSureComponent } from './dialog-sure.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    DialogSureComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    DialogSureComponent
  ],
  entryComponents: [
    DialogSureComponent
  ]
})

export class DialogSureModule {

}
