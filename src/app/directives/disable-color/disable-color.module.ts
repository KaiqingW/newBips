import { NgModule } from '@angular/core';
import { DiableColorDirective } from './disable-color.directive';


@NgModule({
    declarations:[
        DiableColorDirective
    ],
    exports:[
        DiableColorDirective
    ]
})

export class DiableColorDirectiveModule{

}
