import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MomentModule } from 'angular2-moment/moment.module';

import { MatCardModule } from '@angular/material/card';
import { ProjectCardComponent } from "./project-card.component";
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BusinessMeetingRoutingModule } from '../../business-meeting-routing.module';
import { AvatarLogoModule } from 'app/components/avatar-logo/avatar-logo.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatCardModule,
        CompanyLogoModule,
        MatIconModule,
        MatButtonModule,
        BusinessMeetingRoutingModule,
        AvatarLogoModule,
        MomentModule
    ],
    declarations:[
        ProjectCardComponent
    ],
    exports:[
        ProjectCardComponent
    ],
    providers:[]
})

export class ProjectCardModule{

}