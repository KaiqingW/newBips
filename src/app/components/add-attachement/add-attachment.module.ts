import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AddAttachmentComponent } from './add-attachment.component';
import { CommonService } from 'app/core/services/common.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';

@NgModule({
    declarations:[
        AddAttachmentComponent
    ],
    imports :[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports:[
        AddAttachmentComponent
    ],
    providers:[
        CommonService
    ],
    entryComponents:[
        AddAttachmentComponent
    ]
})

export class AddAttchmentModule{

}
