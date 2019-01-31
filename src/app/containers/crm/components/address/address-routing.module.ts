import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ngModuleJitUrl } from '../../../../../../node_modules/@angular/compiler';

import { AddressComponent } from './address.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { EditAddressComponent } from './edit-address/edit-address.component';

import { addressesHeader, addAddressHeader, EditAddressHeader} from 'app/core/models/header';

const businessAddressRoutes: Routes = [
    {
        path:'address',
        component: AddressComponent,
        data: addressesHeader
    },
    {
        path:'add-address',
        component: AddAddressComponent,
        data: addAddressHeader
    },
    {
        path: 'edit-address/:addId',
        component: EditAddressComponent,
        data: EditAddressHeader
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(businessAddressRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class AddressRoutingModule{

}