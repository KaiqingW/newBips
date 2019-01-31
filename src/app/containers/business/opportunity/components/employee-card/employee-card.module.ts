import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { EmployeeCardComponent } from './employee-card.component';
import { MatCardModule } from '@angular/material/card';
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
@NgModule({
    imports:[
        CommonModule,
        MatCardModule,
        CompanyLogoModule,
        FormsModule
    ],
    declarations:[
        EmployeeCardComponent,
       
    ],
    exports:[
        EmployeeCardComponent
    ],
    providers:[

    ]
   
})

export class EmployeeCardModule{

}