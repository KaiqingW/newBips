import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService } from 'app/core/services/inventory.service';
import { CommonService } from 'app/core/services/common.service';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { OpportunityAttachmentComponent } from './opportunity-attachment.component';
import { ShortPipeModule } from 'app/components/short-pipe/short.pipe.module';
import { MatCardModule } from '@angular/material/card';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';

import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AddAttachmentComponent } from './add-attachment/add-attachment.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
    imports :[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        ShortPipeModule,
        ImgModalModule,
        Ng2ImgMaxModule,
        SpinnerModule,
        MatAutocompleteModule,
        
    ],
    declarations:[
        OpportunityAttachmentComponent,
        AddAttachmentComponent
    ],
    exports:[
        OpportunityAttachmentComponent
    ],
    entryComponents:[
        AddAttachmentComponent
    ],
    providers:[
        CommonService,
        InventoryService
    ]
})

export class OpportunityAttachmentModule{

}