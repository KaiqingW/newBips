import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AvatarLogoModule } from 'app/components/avatar-logo/avatar-logo.module';
import { MatCardModule } from '@angular/material/card';
import { ReadMoreModule } from 'app/containers/business-meeting/components/read-more/read-more.module';
import { ShortTextPipe } from './short-text.pipe';

import { NoteCardCompoennt } from './note-card.componnent';
@NgModule({
    imports:[
        AvatarLogoModule,
        MatCardModule,
        CommonModule,
        ReadMoreModule
    ],
    declarations:[
        NoteCardCompoennt,
        ShortTextPipe
    ],
    exports:[
        NoteCardCompoennt
    ],
    providers:[

    ]
})

export class  NoteCardModule{

}