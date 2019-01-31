import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayLeftBarComponent } from './day-left-bar.component'

@NgModule({
    imports:[
        CommonModule
    ],
    declarations:[
        DayLeftBarComponent
    ],
    providers:[

    ],
    exports:[
        DayLeftBarComponent
    ]
})

export class DayLeftbarModule{

}