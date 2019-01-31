import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatCardModule } from '@angular/material/card';
import { CompanyCardComponent } from "./company-card.component";
import { CompanyLogoModule } from "../company-logo/company-logo.module";
import { ProgressBarModule } from "../progress-bar/progress-bar.module";
import { StarModule } from "../star/star.module";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatCardModule,
        CompanyLogoModule,
        ProgressBarModule,
        StarModule
    ],
    declarations:[
        CompanyCardComponent,

    ],
    exports:[
        CompanyCardComponent
    ],
    providers:[]
})

export class CompanyCardModule{

}