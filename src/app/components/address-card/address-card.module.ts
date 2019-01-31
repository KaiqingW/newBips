import { NgModule } from '@angular/core';
import { AddressCardComponent } from './address-card.component';
import { MatCardModule } from '@angular/material';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AddressCardComponent
  ],
  imports: [
    MatCardModule,
    CommonModule
  ],
  exports: [
    AddressCardComponent
  ]
})

export class AddressCardModule {

}
