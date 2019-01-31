import { NgModule } from '@angular/core';
import { ExpoComponent } from './expo.component';
import { RouterModule } from '@angular/router';
import { ExpoRoutes } from './expo.router'; 

@NgModule({
    imports: [
        RouterModule.forChild(ExpoRoutes),
    ],
    declarations: [
        ExpoComponent
    ]
})

export class ExpoModule { };