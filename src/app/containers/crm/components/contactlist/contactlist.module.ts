import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contactlist.component';

import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { ContactService } from 'app/core/services/contact.service';
import {RouterModule} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
@NgModule({
    imports:[
        CommonModule,
        MatCardModule,
        CompanyLogoModule,
        RouterModule,
        SpinnerModule

    ],
    declarations:[
        ContactListComponent
    ],
    exports:[
        ContactListComponent
    ],
    providers:[
        ContactService
    ]
})

export class ContactListModule{

}