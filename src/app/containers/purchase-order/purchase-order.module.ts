import { NgModule } from '@angular/core';
import { PurchaseOrderComponent } from './purchase-order.component';
import { RouterModule } from '@angular/router';
import { PurchaseOrderRoutes } from './purchase-order.router';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { NewOrderItemComponent } from './components/new-order/new-order-item/new-order-item.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { CompanyPurchaseOrderComponent } from './components/company-purchase-order/company-purchase-order.component';
import { CompanySalesOrderComponent } from './components/company-salesorder/company-salesorder.component';
import { UpdateShippedInfoComponent } from './components/order-status/update-shipped-info/update-shipped-info.component';
import { AddShippedComponent } from './components/order-status/add-shipped/add-shipped.component';
import { AddAttachmentComponent } from 'app/containers/purchase-order/components/order-status/attachements/add-attachments/add-attachements.component';
import { AddProdDateComponent } from 'app/containers/purchase-order/components/order-status/prod-date/add-prod-date/add-prod-date.component';
import { FileValidator } from './file-input.validator';
import { ConfirmProdDateComponent } from 'app/containers/purchase-order/components/order-status/prod-date/confirm-prod-date/confirm-prod-date.component';

// pipes
// used for add-shipped
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { OrdersService } from "app/core/services/orders.service";
import { CompanyService } from 'app/core/services/company.service';
import { ShippingInfoService } from 'app/core/services/shippingInfo.service';
import { DatePipe } from '@angular/common';
import { MomentModule } from 'angular2-moment/moment.module';
import { LocalTimePipe } from './local-time.pipe';
import { ShortTextPipe } from './short-text.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule, MatProgressBarModule, MatChipsModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
// import { InventoryModule } from 'app/containers/inventory/inventory.module';

import { ImageUploadModule } from "angular2-image-upload";
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { BusinessNotesService } from 'app/core/services/business-notes.service';
import { BusinessNotesModule } from 'app/components/business-notes/business-notes.module';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';
import { ShareOrderComponent } from './components/share-order/share-order.component';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { ShareDialogComponent } from './components/share-order/share-order.component';
import { ShippingComponent } from './components/order-status/shipping/shipping.component';
import { ProductSearchComponent } from './components/new-order/new-order-item/product-search/product-search.component';
import { OrderCompanyCardComponent } from './components/new-order/order-company-card/order-company-card.component';
import { WarehouseService } from '../../core/services/warehouse.service';
import { InventoryService } from 'app/core/services/inventory.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { LeadService } from '../../core/services/lead.service';
import { OneClickDirectiveModule } from '../../directives/one-click/one-click.module';
import { DownloadService } from '../../core/services/download.service';
import { ContainerInfoComponent } from './components/orders/container-info/container-info.component';
import { OrderItemsCardComponent } from './components/items-card/items-card.component';
import { VrmOrdersComponent } from './components/vrm-orders/vrm-orders.component';
import { OrderContainerStatus } from './components/container_status/container_status.component';
import { OrderProcessBar } from './components/items-card/order-process-bar/order-process-bar.component';
import { OrderProcessBarInfo } from './components/items-card/order-process-bar/order-process-bar-info/order-process-bar-info.component';
import { AttchmentModule } from '../../components/attachment/attachment.module';
import { OrderAttachemntsComponent } from './components/attachments/attachments.component';
import { IconCardComponent } from './components/icon-card/icon-card.component';
import { ViewedIconModule } from '../../components/viewed-icon/viewed-icon.module';
import { EditOrderStatusComponent } from './components/order-status/edit-order-status/edit-order-status.component';
import { AddProductionSubjectComponent } from './components/order-status/production-schedule/add-production-subject/add-production-subject.component';
import { ProductionScheduleComponent } from './components/order-status/production-schedule/production-schedule/production-schedule.component';
import { ConfirmProductionDateComponent } from './components/order-status/production-schedule/confirm-production-date/confirm-production-date.component';
import { AuthService } from '../../core/services/auth.service';
import { SearchService } from '../../core/services/search.service';
import { ProductSearchBarModule } from '../inventory/components/product-search-bar/product-search-bar.module';


@NgModule({
  imports: [
    // forChild is used for child component, like inventory.component
    RouterModule.forChild(PurchaseOrderRoutes),
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerModule,
    MomentModule,
    MatDialogModule,
    MatFormFieldModule,
    ImageUploadModule,
    ImgModalModule,
    AddButtonModule,
    BusinessNotesModule,
    ProfilePictureModule,
    MatAutocompleteModule,
    CompanyLogoModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    // InventoryModule
    OneClickDirectiveModule,
    MatProgressBarModule,
    AttchmentModule,
    ViewedIconModule,
    ProductSearchBarModule,
    
  ],
  declarations: [
    PurchaseOrderComponent,
    OrderDetailsComponent,
    NewOrderComponent,
    OrdersComponent,
    OrderStatusComponent,
    CompanyPurchaseOrderComponent,
    CompanySalesOrderComponent,
    UpdateShippedInfoComponent,
    AddShippedComponent,
    NewOrderItemComponent,
    AddAttachmentComponent,
    AddProdDateComponent,
    ConfirmProdDateComponent,
    FileValidator,
    LocalTimePipe,
    ShortTextPipe,
    ShareOrderComponent,
    ShareDialogComponent,
    ShippingComponent,
    ProductSearchComponent,
    OrderCompanyCardComponent,
    ContainerInfoComponent,
    OrderItemsCardComponent,
    VrmOrdersComponent,
    OrderContainerStatus,
    OrderProcessBar,
    OrderProcessBarInfo,
    OrderAttachemntsComponent,
    IconCardComponent,
    EditOrderStatusComponent,
    AddProductionSubjectComponent,
    ProductionScheduleComponent,
    ConfirmProductionDateComponent
  ],

  entryComponents: [ConfirmProductionDateComponent, AddProductionSubjectComponent, ShareDialogComponent, AddShippedComponent, AddAttachmentComponent, ConfirmProdDateComponent, AddProdDateComponent],
  providers: [CompanyService, SearchService, AuthService, InventoryService, DownloadService, LeadService, OrdersService, ShippingInfoService, DatePipe, BusinessNotesService, WarehouseService],
  exports: []
})
export class PurchaseOrderModule { }
