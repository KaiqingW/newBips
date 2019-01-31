import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ItemComponent, AddToCartDialog } from './item/item.component';
import { WeatherService } from '../../core/services/weather.service';
import { RouterModule } from '@angular/router';
import { ShopRoutes } from './shop.router'; 
import { MatMenuModule, MatIconModule, MatSidenavModule, MatToolbarModule, } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { CommonService } from 'app/core/services/common.service';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { ShortPipeModule } from 'app/components/short-pipe/short.pipe.module';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';

//angular material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule  } from '@angular/material/radio';


//services
import { DeliveryOptionsDataService } from "../../core/services/delivery-options.service";
import { ProductsDataService } from "../../core/services/products.service";
import { ShoppingCartService } from "../../core/services/shopping-cart.service";
import { CartService } from "../../core/services/cart.service";
import { LocalStorageServie, StorageService } from "../../core/services/storage.service";
import { ShopService } from '../../core/services/shop.service';
import { UpsService } from '../../core/services/ups.service';


import { CartComponent } from './cart/cart.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { UpsShippingComponent } from './ups-shipping/ups-shipping.component';
import { ChooseWhsComponent } from './choose-whs/choose-whs.component';
import { AddrComponent } from './addr/addr.component';
import { SelectBarModule } from '../../components/select-bar/select-bar.module';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ShopSearchBarComponent } from './search-bar/search-bar.component';
import { ViewedProductsComponent } from './viewed-products/viewed-products.component';
import { DepartmentComponent } from './department/department.component';
import { ShortTextPipe }  from './short-text.pipes';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [
    ShopComponent,
    ItemComponent,
    AddToCartDialog,
    CartComponent,
    LandingPageComponent,
    CheckoutComponent,
    UpsShippingComponent,
    ChooseWhsComponent,
    AddrComponent,
    WarehouseComponent,
    ShopSearchBarComponent,
    ViewedProductsComponent,
    DepartmentComponent,
    ShortTextPipe
  ],
  entryComponents: [AddToCartDialog],
  
  imports: [
    RouterModule.forChild(ShopRoutes),
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    ShortPipeModule,
    ImgModalModule,
    SpinnerModule,
    SelectBarModule,
    FooterModule
  ],

  exports: [
    ShopComponent
  ],

  providers: [
    WeatherService,
    ShopService,
    UpsService,
    CommonService,
    DeliveryOptionsDataService,
    ProductsDataService,
    ShoppingCartService,
    CartService,
    LocalStorageServie,
    { provide: StorageService, useClass: LocalStorageServie },
    {
      deps: [StorageService, ProductsDataService, DeliveryOptionsDataService],
      provide: ShoppingCartService,
      useClass: ShoppingCartService
    }
  ],

})

export class ShopModule {
  
}