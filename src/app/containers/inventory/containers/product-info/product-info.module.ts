import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInfoComponent } from './product-info.component';

import { RouterModule } from '@angular/router';

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
import { InventoryService } from '../../../../core/services/inventory.service';
import { WarehouseService } from '../../../../core/services/warehouse.service';
import { CommonService } from 'app/core/services/common.service';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ListTreeModule } from 'app/components/list-tree/list-tree.component.module';

import { AttchmentModule } from 'app/components/attachment/attachment.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectBarModule } from '../../../../components/select-bar/select-bar.module';
import { OneClickDirectiveModule } from '../../../../directives/one-click/one-click.module';
import { VrmBaBaService } from '../../../vrm/vrm.service';
import { CopyService } from '../../../../core/services/copy.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { MatListModule } from '@angular/material';
import { AddAttachmentComponent } from './add-attachments/add-attachments.component';
import { ProductCategoryCardCompnent } from './category-card/category-card.component';
import { WholesalePriceTableComponent } from './wholesale-price-table/wholesale-price-table.component';
import { AddWholesalePriceTableComponent } from './add-wholesale-price-table/add-wholesale-price-table.component';
import { WholesalePriceComponent} from './wholesale-price/wholesale-price.component';
@NgModule({

  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    SpinnerModule,
    RouterModule,
    AddButtonModule,
    UploadImgModule,
    ShortPipeModule,
    ImgModalModule,
    MatRadioModule,
    BusinessNotesModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    ListTreeModule,
    AttchmentModule,
    MatTabsModule,
    SelectBarModule,
    OneClickDirectiveModule,
  ],
  declarations: [
    ProductInfoComponent,
    AddAttachmentComponent,
    ProductCategoryCardCompnent,
    WholesalePriceTableComponent,
    AddWholesalePriceTableComponent,
    WholesalePriceComponent,
  ],
  exports: [
    ProductInfoComponent
  ],
  entryComponents: [
    AddAttachmentComponent,
  ],
  providers: [
    InventoryService,
    WarehouseService,
    CommonService,
    VrmBaBaService,
    CopyService,
    DialogService,
    MatListModule,
  ]
})
export class ProductInfoModule { }
