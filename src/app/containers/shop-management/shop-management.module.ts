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
import { ShopManagementRoutes } from './shop-management.router';
import { ShopManagementComponent } from './shop-management.component';
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
import { SelectBarModule } from '../../components/select-bar/select-bar.module';
import { AddButtonModule } from '../../components/add-button/add-button.module';
import { SearchBarModule } from '../../components/search-bar/search-bar.module';
import { UploadSingleImgModule } from '../../components/upload-single-img/upload-single-img.module';
import { AddressCardModule } from '../../components/address-card/address-card.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { UpsService } from '../../core/services/ups.service';
import { MomentModule } from 'angular2-moment/moment.module';
import { LocalTimePipe } from './local-time.pipe';
import { ShopComponent } from './containers/shop/shop.component';
import { ShopManagementProductEditComponent } from './containers/shop-management-product-edit/shop-management-product-edit.component';
import { ProductInfoModule } from '../inventory/containers/product-info/product-info.module';
import { PriceTableComponent } from './containers/shop-management-product-edit/price-table/price-table.component';
import { ShopCateogryComponent } from './containers/shop-management-product-edit/shop-category/shop-category.component';
import { AddShopProductComponent } from './containers/add-shop-product/add-shop-product.component';
import { OrderHistoryCardComponent } from './containers/order-list/order-history-card/order-history-card.component';
import { OrderListComponent } from './containers/order-list/order-list.component';
import { ShopOrderDetailComponent } from './containers/shop-order-detail/shop-order-detail.component';
import { UpdateOrderStatusComponent } from './containers/shop-order-detail/company-detail/update-order-status/update-order-status.component';
import { CompanyDetailComponent } from './containers/shop-order-detail/company-detail/company-detail.component';
import { EditorModule } from '../../components/editor/editor.module';
import { AddSalesPitchComponent } from './containers/add-sales-pitch-subject/add-sales-pitch/add-sales-pitch.component';
import { AddSalesPitchSubjectComponent } from './containers/add-sales-pitch-subject/add-sales-pitch-subject.component';
import { SalesPitchSubjectComponent } from './containers/add-sales-pitch-subject/sales-pitch-subject/sales-pitch-subject.component';
import { SalesPitchComponent } from './containers/add-sales-pitch-subject/sales-pitch-subject/sales-pitch/sales-pitch.component';
import { ShopManagementService } from '../../core/services/shop-management.service';
import { ShortTextPipe } from './short-text.pipe';
import { ShopProductDescriptionComponent } from './containers/shop-management-product-edit/product-description/product-description.component';
import { ShippingInfoComponent } from './containers/shop-management-product-edit/shipping-info/shipping-info.component';
import { AttchmentModule } from 'app/components/attachment/attachment.module';
import { InventoryService } from '../../core/services/inventory.service';
import { WarehouseService } from '../../core/services/warehouse.service';
import { CopyService } from '../../core/services/copy.service';

import { from } from 'rxjs/observable/from';
import { AddRelatedProductsComponent } from './containers/shop-management-product-edit/add-related-products/add-related-products.component';
@NgModule({
  imports: [
    RouterModule.forChild(ShopManagementRoutes),
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
    SelectBarModule,
    AddButtonModule,
    SearchBarModule,
    UploadSingleImgModule,
    AddressCardModule,
    MatToolbarModule,
    MomentModule,
    EditorModule,
    MatButtonToggleModule,
    AttchmentModule,
    ProductInfoModule,
  ],
  declarations: [
    ShopManagementComponent,
    ShopComponent,
    ShopManagementProductEditComponent,
    PriceTableComponent,
    ShopCateogryComponent,
    AddShopProductComponent,
    OrderHistoryCardComponent,
    OrderListComponent,
    ShopOrderDetailComponent,
    UpdateOrderStatusComponent,
    CompanyDetailComponent,
    AddSalesPitchSubjectComponent,
    AddSalesPitchComponent,
    LocalTimePipe,
    SalesPitchSubjectComponent,
    SalesPitchComponent,
    ShortTextPipe,
    ShopProductDescriptionComponent,
    ShippingInfoComponent,
    AddRelatedProductsComponent,
    // ProductInfoComponent,
    // AddAttachmentComponent,
  ],
  providers: [
    ToasterService,
    CompanyService,
    CommonService,
    ShopService,
    UpsService,
    ShopManagementService,
    InventoryService, 
    WarehouseService,
    CopyService
  ],
  exports: [
    OrderListComponent,
    ShopOrderDetailComponent
  ]
})

export class ShopManagementModule {

}
