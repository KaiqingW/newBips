import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductCardComponent } from './list-product-card.component';
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShortPipeModule } from '../../../../components/short-pipe/short.pipe.module';
import { SelectBarModule } from '../../../../components/select-bar/select-bar.module';

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
