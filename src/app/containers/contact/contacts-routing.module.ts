import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { ContactListComponent } from './containers/contactList/contactList.component';
import { AddContactComponent } from './containers/addcontact/addcontact.component';
import { ContactDetailsConponent } from './containers/contact-details/contact-details.component';
import { personalContactListHeader, addPersonalContactHeader,personalContactDetailsHeader } from 'app/core/models/header';

const contactRoutes :Routes=[
    {
        path:'contactList',
        component: ContactListComponent,
        data: personalContactListHeader
    },
    {
        path: 'add',
        component: AddContactComponent,
        data: addPersonalContactHeader
    },
    {
        path: ':contId',
        component: ContactDetailsConponent,
        data: personalContactDetailsHeader
    }

]

@NgModule({
    imports:[
        RouterModule.forChild(contactRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})
export class ContactRoutingModule{

}