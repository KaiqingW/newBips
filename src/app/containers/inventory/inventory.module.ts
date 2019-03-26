import { NgModule } from '@angular/core';
import { InventoryComponent } from './inventory.component';
import { RouterModule } from '@angular/router';
import { InventoryRoutes } from './inventory.router';
import { CommonModule } from '@angular/common';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { UploadImgModule } from 'app/components/upload-img/upload-img.module';
import { ShortPipeModule } from 'app/components/short-pipe/short.pipe.module';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';

//angular material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule  } from '@angular/material/radio';
import { BusinessNotesModule } from 'app/components/business-notes/business-notes.module';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { InventoryService } from '../../core/services/inventory.service';
import { WarehouseService } from '../../core/services/warehouse.service';
import { CommonService } from 'app/core/services/common.service';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ListTreeModule } from 'app/components/list-tree/list-tree.component.module';

import { AttchmentModule } from 'app/components/attachment/attachment.module';
import {MatTabsModule} from '@angular/material/tabs';
import { SelectBarModule } from '../../components/select-bar/select-bar.module';
import { OneClickDirectiveModule } from '../../directives/one-click/one-click.module';
import { VrmBaBaService } from '../vrm/vrm.service';
import { CopyService } from '../../core/services/copy.service';
import { DialogService } from '../../core/services/dialog.service';
import { MatListModule } from '@angular/material';
import { ProductInfoModule } from './containers/product-info/product-info.module';
// import { ProductInfoComponent } from './containers/product-info/product-info.component';
import { ProductAddComponent } from './containers/product-add/product-add.component';
import { WarehouseDetailCompnent } from './containers/warehouse-detail/warehouse-detail.component';
import { AddWarehouseTransactionComponent } from './containers/add-warehouse-trans/add-warehouse-trans.component';
import { AddAttachmentComponent } from './containers/product-info/add-attachments/add-attachments.component';
import { PriceTableComponent } from './containers/price-table/price-table.component';
import { ProductCategoryCardCompnent } from './containers/product-info/category-card/category-card.component';
import { InventoryCategoryComponent } from './containers/product-add/inventory-category/inventory-category.component';
import { WholesalePriceTableComponent } from './containers/product-info/wholesale-price-table/wholesale-price-table.component';
import { AddWholesalePriceTableComponent } from './containers/product-info/add-wholesale-price-table/add-wholesale-price-table.component';
import { ProductEditComponent } from './containers/product-edit/product-edit.component';
import { ServiceAddComponent } from './containers/service-add/service-add.component';
import { ChooseAddTypeCompoent } from './containers/choose-add-type/choose-add-type.component';
import { ProductListComponent } from './containers/product-list/product-list.component';
import { ProductSearchBarModule } from './components/product-search-bar/product-search-bar.module';
import { WholesalePriceComponent} from './containers/product-info/wholesale-price/wholesale-price.component';
// import { WholesalePriceTableModule} from './containers/product-info/wholesale-price-table/wholesale-price-table.module';
// import { AddWholesalePriceTableModule} from './containers/product-info/add-wholesale-price-table/add-wholesale-price-table.module';
// import { CategoryCardModule} from './containers/product-info/category-card/category-card.module';


@NgModule({
    imports: [
        // forChild is used for child component, like inventory.component
        RouterModule.forChild(InventoryRoutes),
        CommonModule,
        //material
        MatCardModule,
        MatIconModule,
        MatAutocompleteModule,
        MatInputModule,
        MatChipsModule,
        MatRadioModule,
        MatSelectModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDialogModule,
        UploadImgModule,
        AddButtonModule,
        BusinessNotesModule,
        FormsModule,
        ShortPipeModule,
        ReactiveFormsModule,
        ImgModalModule,
        SpinnerModule,
        MatTabsModule,
        ////
        AttchmentModule,
        MatCheckboxModule,
        ListTreeModule,
        SelectBarModule,
        OneClickDirectiveModule,
        MatListModule,
        ProductSearchBarModule,
        ProductInfoModule,
        // WholesalePriceModule,
        // CategoryCardModule,
        // WholesalePriceTableModule,
        // AddWholesalePriceTableModule,
    ],
    declarations: [
        InventoryComponent,
        ProductListComponent,
        ProductAddComponent,
        WarehouseDetailCompnent,
        AddWarehouseTransactionComponent,
        // AddAttachmentComponent,
        PriceTableComponent,
        // WholesalePriceComponent,
        // ProductCategoryCardCompnent,
        InventoryCategoryComponent,
        // WholesalePriceTableComponent,
        // AddWholesalePriceTableComponent,
        ProductEditComponent,
        ServiceAddComponent,
        ChooseAddTypeCompoent,

    ],
    entryComponents: [AddWarehouseTransactionComponent, AddAttachmentComponent],
    providers:[DialogService, InventoryService, WarehouseService, CommonService, VrmBaBaService, CopyService]
})

export class InventoryModule { }
