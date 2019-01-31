import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {MatCardModule} from '@angular/material/card';

import { PanelCardComponent } from "./panel-card.component";
import { PanelCardTitleComponent } from "./panel-card-title/panel-card-title.component";
import { PanelCardBodyComponent } from "./panel-card-body/panel-card-body.component";
import { PanelMoreButtonComponent } from "./panel-more-button/panel-more-button.component";

@NgModule({
    imports:[
        FormsModule,
        CommonModule,
        MatCardModule
    ],
    declarations:[
        PanelCardComponent,
        PanelCardTitleComponent,
        PanelCardBodyComponent,
        PanelMoreButtonComponent
    ],
    exports:[
        PanelCardComponent,
        PanelCardTitleComponent,
        PanelCardBodyComponent,
        PanelMoreButtonComponent
    ],
    providers:[

    ]
})

export class PanelCardModule{

}