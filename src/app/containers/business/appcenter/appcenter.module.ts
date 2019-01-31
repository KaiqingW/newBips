import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCenterComponent } from './appcenter.component';

import { AppCenterRoutingModule } from './appcenter-routing.module';
import { LogoModule } from 'app/components/logo/logo.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
@NgModule({
    imports:[
        CommonModule,
        AppCenterRoutingModule,
        LogoModule,
        SpinnerModule
    ],
    declarations: [
        AppCenterComponent
    ],
    providers:[

    ],
    exports: [
        AppCenterComponent
    ]

})

export class AppCenterModule{

}