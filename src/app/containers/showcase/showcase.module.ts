import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShowcaseRoutes } from './showcase.router';
import { ShowcaseComponent } from './showcase.component';
import { CommonModule } from '@angular/common';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { ShowcaseListComponent } from './showcase-list/showcase-list.component';
import { ShowcaseAddComponent } from './showcase-add/showcase-add.component';
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

import { AddAttachmentComponent } from 'app/containers/inventory/containers/product-info/add-attachments/add-attachments.component';
import { BusinessNotesModule } from 'app/components/business-notes/business-notes.module';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { InventoryService } from '../../core/services/inventory.service';
import { WarehouseService } from '../../core/services/warehouse.service';
import { CommonService } from 'app/core/services/common.service';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { VrmBaBaService } from 'app/containers/vrm/vrm.service';
import { SearchService } from 'app/core/services/search.service';


// import { BusinessNotesModule } from 'app/components/business-notes/business-notes.module';


@NgModule({
    imports: [
        // forChild is used for child component, like inventory.component
        RouterModule.forChild(ShowcaseRoutes),
        CommonModule,
        MatCardModule,
        MatIconModule,
        AddButtonModule,
        SpinnerModule,
        UploadImgModule,
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
        // BusinessNotesModule
    ],
    declarations: [
        ShowcaseComponent,
        ShowcaseListComponent,
        ShowcaseAddComponent,
    ],
    providers:[
        InventoryService, WarehouseService, CommonService,
        VrmBaBaService,
        SearchService
    ]
})

export class ShowcaseModule { }
