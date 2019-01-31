import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { StatusContentComponent } from './status-content.component';

import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { ReadMoreModule } from 'app/containers/business-meeting/components/read-more/read-more.module';

@NgModule({
    imports:[
        CommonModule,
        MatCardModule,    
        ImgModalModule,
        ReadMoreModule,
        MatIconModule
    ],
    declarations:[
        StatusContentComponent
    ],
    exports:[
        StatusContentComponent
    ],
    providers:[]
})

export class SubjectContentModule{

}