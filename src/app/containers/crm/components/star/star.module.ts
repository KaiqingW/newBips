import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StarComponent } from './star.component';
import { LeadService } from 'app/core/services/lead.service';

@NgModule({
    imports:[
        CommonModule
    ],
    declarations:[
        StarComponent
    ],
    providers:[
        LeadService
    ],
    exports:[
        StarComponent
    ]
})

export class StarModule{

}