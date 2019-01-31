
import { NgModule } from '@angular/core';
import { LogoComponent } from './logo.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        LogoComponent        
    ],
    exports: [
        LogoComponent        
    ]
})

export class LogoModule {
    
}