import { NgModule } from '@angular/core';
import { DialogYesComponent } from './dialog-yes.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    DialogYesComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    DialogYesComponent
  ],
  entryComponents: [
    DialogYesComponent
  ]
})

export class DialogYesModule {

}
