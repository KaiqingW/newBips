import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatCardModule } from '@angular/material/card';
import { LeftDayBarComponent } from "./left-day-bar.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatCardModule,
     
    ],
    declarations:[
        LeftDayBarComponent
    ],
    exports:[
        LeftDayBarComponent
    ],
    providers:[]
})

export class LeftDayBarModule{

}