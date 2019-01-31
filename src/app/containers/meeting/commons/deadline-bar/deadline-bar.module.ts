import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DeadlineBarComponent } from "./deadline-bar.component";


@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        DeadlineBarComponent
    ],
    exports:[
        DeadlineBarComponent
    ]

})

export class DeadlineBarModule{

}