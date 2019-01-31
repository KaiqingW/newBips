import { NgModule } from '@angular/core';
import { WarehouseComponent } from './warehouse.component';
import { RouterModule } from '@angular/router';
import { WarehouseRoutes } from './warehouse.router';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { CommonModule } from '@angular/common';


//angular material modules
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

// pipes
// used for add-shipped
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { OrdersService } from "app/core/services/orders.service";
import { ShippingInfoService } from 'app/core/services/shippingInfo.service';
import { DatePipe } from '@angular/common';
import { MomentModule } from 'angular2-moment/moment.module';
import { ShortPipeModule } from 'app/components/short-pipe/short.pipe.module';
import { CompanyCardModule } from "app/containers/crm/components/company-card/company-card.module";
import { PanelCardModule } from "app/containers/crm/components/panel-card/panel-card.module";
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module'
import { CalendarModule } from 'app/components/calendar/calendar.module';
import { WarehouseCardModule } from './components/warehouse-card/warehouse-card.module';
import { ImageUploadModule } from "angular2-image-upload";
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { AgmCoreModule } from '@agm/core';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { ProductCardModule } from 'app/components/product-card/product-card.module';
//Components
//services
import { WarehouseService } from 'app/core/services/warehouse.service';
import { DiableColorDirectiveModule } from '../../directives/disable-color/disable-color.module';
import { SearchBarModule } from './components/search-bar/search-bar.module';
import { AddWarehouseInventoryComponent } from './containers/add-warehouse-inventory/add-warehouse-inventory.component';
import { ListProductCardModule } from './components/list-product-card/list-product-card.module';
import { HousesComponent } from './containers/houses/houses.component';
import { AddWarehouseComponent } from './containers/houses/add-warehouse/add-warehouse.component';
import { ShippingsComponent } from './containers/houses/shippings/shippings.component';
import { ExportShippingsComponent } from './containers/houses/shippings/export/export.component';
import { ImportShippingComponent } from './containers/houses/shippings/import/import.component';
import { ContainerInfoComponent } from './containers/houses/container-info/container-info.component';
import { BatchCardComponent } from './containers/houses/container-info/batch-card/batch-card.component';
import { ConditionCardComponent } from './containers/houses/container-info/condition-card/condition-card.component';
import { AddWarehouseInventoryQtyComponent } from './containers/add-warehouse-inventory-qty/add-warehouse-inventory-qty.component';
import { ListProductTransactionCardModule } from './components/list-product-transaction-card/list-product-transaction-card.module';
import { OrderListComponent } from './containers/order-list/order-list.component';
import { OrderHistoryCardComponent } from './containers/order-list/order-history-card/order-history-card.component';
import { ShopOrderDetailComponent } from './containers/shop-order-detail/shop-order-detail.component';
import { CompanyDetailComponent } from './containers/shop-order-detail/company-detail/company-detail.component';
import { UpdateOrderStatusComponent } from './containers/shop-order-detail/company-detail/update-order-status/update-order-status.component';
import { AddressCardModule } from '../../components/address-card/address-card.module';
import { SelectBarModule } from '../../components/select-bar/select-bar.module';
import { ProcessShopOrderComponent } from './containers/process-shop-order/process-shop-order.component';
import { SendInvoiceComponent } from './containers/send-invoice/send-invoice.component';
import { CartService } from '../../core/services/cart.service';
import { VrmBaBaService } from '../vrm/vrm.service';

@NgModule({
  imports: [
    // forChild is used for child component, like inventory.component
    RouterModule.forChild(WarehouseRoutes),
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerModule,
    MomentModule,
    MatDialogModule,
    MatFormFieldModule,
    ImageUploadModule,
    ImgModalModule,
    AddButtonModule,
    ShortPipeModule,
    // UploadImgModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    CompanyCardModule,
    PanelCardModule,
    CompanyLogoModule,
    ProductCardModule,
    ProfilePictureModule,
    CalendarModule,
    MatSelectModule,
    SearchBarModule,
    DiableColorDirectiveModule,
    ListProductCardModule,
    ListProductTransactionCardModule,
    WarehouseCardModule,
    AddressCardModule,
    SelectBarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCuk-e9VS44P-xTJAO7PzI7V-v2JHdj6jo'
    })
  ],
  declarations: [
    WarehouseComponent,
    HousesComponent,
    AddWarehouseComponent,
    ShippingsComponent,
    ExportShippingsComponent,
    ImportShippingComponent,
    ContainerInfoComponent,
    BatchCardComponent,
    ConditionCardComponent,
    AddWarehouseInventoryComponent,
    AddWarehouseInventoryQtyComponent,
    OrderListComponent,
    OrderHistoryCardComponent,
    ShopOrderDetailComponent,
    CompanyDetailComponent,
    UpdateOrderStatusComponent,
    ProcessShopOrderComponent,
    SendInvoiceComponent
  ],
  entryComponents: [],  // for the dialog!!
  providers: [WarehouseService, DatePipe, ShippingInfoService, CartService, VrmBaBaService],
  exports: []
})
export class WarehouseModule {}
