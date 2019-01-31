import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AvatarLogoComponent } from "./avatar-logo.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
    ],
    declarations:[
        AvatarLogoComponent
    ],
    exports:[
        AvatarLogoComponent
    ],
    providers:[

    ]
})

export class AvatarLogoModule{

}