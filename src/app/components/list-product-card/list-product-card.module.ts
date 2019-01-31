import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductCardComponent } from './list-product-card.component';
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';
import { ShortPipeModule } from '../short-pipe/short.pipe.module';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectBarModule } from '../select-bar/select-bar.module';

@NgModule({
  declarations: [
    ListProductCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ShortPipeModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectBarModule
  ],
  exports: [
    ListProductCardComponent
  ]
})

export class ListProductCardModule {

}
