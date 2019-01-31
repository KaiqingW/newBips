import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewedIconComponent } from './viewed-icon.component';


@NgModule({
    declarations: [
        ViewedIconComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    exports: [
        ViewedIconComponent
    ]
})

export class ViewedIconModule {

}
