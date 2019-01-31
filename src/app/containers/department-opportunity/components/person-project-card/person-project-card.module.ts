import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatCardModule } from '@angular/material/card';
import { PersonProjectCardComponent } from './person-project-card.component';

import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentOpportunityRoutingModule } from '../../department-opportunity-routing.module';
import { MomentModule } from 'angular2-moment/moment.module';

import { AvatarLogoModule } from 'app/components/avatar-logo/avatar-logo.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MatCardModule,
        CompanyLogoModule,
        MatIconModule,
        MatButtonModule,
        DepartmentOpportunityRoutingModule,
        AvatarLogoModule,
        MomentModule
    ],
    declarations:[
        PersonProjectCardComponent
    ],
    exports:[
        PersonProjectCardComponent
    ],
    providers:[]
})

export class PersonProjectCardModule{

}