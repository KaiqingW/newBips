import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { WarehouseCardComponent } from "./warehouse-card.component";
import { WarehouseLogoModule } from "../warehouse-logo/warehouse-logo.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WarehouseLogoModule
    ],
    declarations: [
        WarehouseCardComponent
    ],
    exports: [
        WarehouseCardComponent
    ],
    providers: [

    ]
})

export class WarehouseCardModule {

}