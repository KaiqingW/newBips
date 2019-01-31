import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { WarehouseLogoComponent } from "./warehouse-logo.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
    ],
    declarations:[
        WarehouseLogoComponent
    ],
    exports:[
        WarehouseLogoComponent
    ],
    providers:[

    ]
})

export class WarehouseLogoModule{

}