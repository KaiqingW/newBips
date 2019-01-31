import { NgModule } from '@angular/core';
import { OneClickDirective } from './one-click.directive';


@NgModule({
    declarations:[
        OneClickDirective
    ],
    exports:[
        OneClickDirective
    ]
})

export class OneClickDirectiveModule{

}
