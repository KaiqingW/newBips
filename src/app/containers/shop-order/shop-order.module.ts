import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'app/components/avatar/avatar.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { ToasterService } from 'app/core/services/toaster.service';
import { MatCardModule } from '@angular/material/card';
import { CompanyService } from 'app/core/services/company.service';
import { CommonService } from '../../core/services/common.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ListProductCardModule } from '../../components/list-product-card/list-product-card.module';
import { ShortPipeModule } from '../../components/short-pipe/short.pipe.module';
import { ImgModalModule } from '../../components/img-modal/img-modal.module';
import { ListTreeModule } from '../../components/list-tree/list-tree.component.module';
import { ShopService } from '../../core/services/shop.service';
import { MatSelectModule } from '@angular/material/select';
import { ShopOrderRoutes } from './shop-order.router';
import { ShopOrderComponent } from './shop-order.component';
import { ShopManagementModule } from '../shop-management/shop-management.module';
import { OrdersComponent } from './containers/orders/orders.component';

@NgModule({
  imports: [
    RouterModule.forChild(ShopOrderRoutes),
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    AvatarModule,
    SpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatChipsModule,
    MatCardModule,
    MatTabsModule,
    ListProductCardModule,
    ShortPipeModule,
    ImgModalModule,
    ListTreeModule,
    MatSelectModule,
    ShopManagementModule
  ],
  declarations: [
    OrdersComponent,
    ShopOrderComponent
  ],
  providers: [
    ToasterService,
    CompanyService,
    CommonService,
    ShopService
  ]
})

export class ShopOrderModule {

}
