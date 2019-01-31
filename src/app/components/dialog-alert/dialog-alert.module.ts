import { NgModule } from '@angular/core';
import { DialogAlertComponent } from './dialog-alert.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    DialogAlertComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    DialogAlertComponent
  ],
  entryComponents: [
    DialogAlertComponent
  ]
})

export class DialogAlertModule {

}
