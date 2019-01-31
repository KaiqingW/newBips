import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ProductModalComponent } from "./product-modal.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
    ],
    declarations:[
        ProductModalComponent
    ],
    exports:[
        ProductModalComponent
    ],
    providers:[

    ]
})

export class ProductModalModule{

}