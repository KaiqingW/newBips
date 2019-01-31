import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { OppoDollarProgressBarComponent } from "./oppo-dollar-progress-bar.component";
import { MatSelectModule } from '@angular/material';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatSelectModule
    ],
    declarations:[
        OppoDollarProgressBarComponent
    ],
    exports:[
        OppoDollarProgressBarComponent
    ]

})

export class OppoDollarProgressBarModule{

}