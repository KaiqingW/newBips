import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ProgressBarComponent } from "./progress-bar.component";
import { MatSelectModule } from '@angular/material';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatSelectModule
    ],
    declarations:[
        ProgressBarComponent
    ],
    exports:[
        ProgressBarComponent
    ]

})

export class ProgressBarModule{

}