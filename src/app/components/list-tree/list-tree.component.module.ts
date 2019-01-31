import { NgModule } from '@angular/core';
import { ListTreeComponent } from './list-tree.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListLeafComponent } from './list-leaf/list-leaf.component';

@NgModule({
  declarations: [
    ListTreeComponent,
    ListLeafComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ListTreeComponent
  ]
})

export class ListTreeModule {

}
