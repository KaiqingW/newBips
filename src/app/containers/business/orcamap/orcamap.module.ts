import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrcaMapComponent } from './orcamap.component';
import { OrcaMapRoutingModule } from './orcamap-routing.module';


@NgModule({
    imports: [
        CommonModule,
        OrcaMapRoutingModule
    ],
    declarations:[
        OrcaMapComponent
    ],
    providers:[

    ],
    exports:[
        OrcaMapComponent
    ]
})

export class OrcaMapModule{

}