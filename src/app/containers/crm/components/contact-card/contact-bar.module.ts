import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiableColorDirectiveModule } from '../../../../directives/disable-color/disable-color.module';
import { ContactBarComponent } from './contact-bar.component';
import { MatIconModule } from '@angular/material';
// import { CustomerAssignModule } from 'app/containers/crm/components/customer-assign/customer-assign.module';


@NgModule({
    imports: [
        CommonModule,
        DiableColorDirectiveModule,
        MatIconModule,
        // CustomerAssignModule
    ],
    declarations: [
        ContactBarComponent
    ],
    exports: [
        ContactBarComponent
    ],
    providers: [

    ]
})

export class ContactBarModule { }
