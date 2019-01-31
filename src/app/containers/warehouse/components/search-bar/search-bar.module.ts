import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelCardModule } from "app/containers/crm/components/panel-card/panel-card.module";
import { SearchBarComponent } from './search-bar.component';
import { MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatChipsModule, MatAutocompleteModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports:[
        CommonModule,
        PanelCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule
    ],
    declarations:[
        SearchBarComponent
    ],
    providers:[

    ],
    exports:[
        SearchBarComponent
    ]
})

export class SearchBarModule {

}