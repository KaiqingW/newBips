import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { OppoProgressBarComponent } from "./oppo-progress-bar.component";
import { MatSelectModule } from '@angular/material';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatSelectModule
    ],
    declarations:[
        OppoProgressBarComponent
    ],
    exports:[
        OppoProgressBarComponent
    ]

})

export class OppoProgressBarModule{

}