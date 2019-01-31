import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinancialComponent } from './financial.component';
import { FinancialRoutingModule } from './financial-routing.module';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FinancialRoutingModule
    ],
    declarations:[
        FinancialComponent
    ],
    exports:[
        FinancialComponent
    ],
    providers:[

    ]
})

export class FinancialModule{

}