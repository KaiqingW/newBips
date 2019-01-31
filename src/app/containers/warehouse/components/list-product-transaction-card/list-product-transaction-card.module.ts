import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShortPipeModule } from '../../../../components/short-pipe/short.pipe.module';
import { SelectBarModule } from '../../../../components/select-bar/select-bar.module';
import { ListProductTransactionCardComponent } from './list-product-transaction-card.component';

@NgModule({
  declarations: [
    ListProductTransactionCardComponent
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
    ListProductTransactionCardComponent
  ]
})

export class ListProductTransactionCardModule {

}
