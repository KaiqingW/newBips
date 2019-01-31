import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { EditEmailMessageComponent } from './edit-email-message/edit-email-message.component';

import { editMessageHeader} from 'app/core/models/header';

const sendEmailMessageRoutes: Routes = [
    
    {
        path: 'edit-email-message',
        component: EditEmailMessageComponent,
        data: editMessageHeader
    },

];

@NgModule({
    imports:[
        RouterModule.forChild(sendEmailMessageRoutes),
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class SendEmailMessageRoutingModule{

}