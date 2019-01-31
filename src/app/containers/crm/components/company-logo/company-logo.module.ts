import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { CompanyLogoComponent } from "./company-logo.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
    ],
    declarations:[
        CompanyLogoComponent
    ],
    exports:[
        CompanyLogoComponent
    ],
    providers:[

    ]
})

export class CompanyLogoModule{

}