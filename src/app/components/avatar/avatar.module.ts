import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        MatIconModule,
        CommonModule
    ],
    declarations: [
        AvatarComponent
    ],
    exports: [
        AvatarComponent
    ]
})

export class AvatarModule {
    
}