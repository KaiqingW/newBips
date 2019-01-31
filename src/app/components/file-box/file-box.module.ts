import { NgModule } from '@angular/core';
import { FileBoxComponent } from './file-box.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material';


@NgModule({
  declarations: [
    FileBoxComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule
  ],
  exports: [
    FileBoxComponent
  ]
})

export class FileBoxModule {

}
