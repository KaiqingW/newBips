import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatInputModule, MatOptionModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ProductSearchBarComponent } from './product-search-bar.component';


@NgModule({
  declarations: [
    ProductSearchBarComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatAutocompleteModule
  ],
  exports: [
    ProductSearchBarComponent
  ]
})

export class ProductSearchBarModule {

}
