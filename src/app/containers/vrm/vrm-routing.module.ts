import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProspectComponent } from './containers/prospect/prospect.component';
import { MainComponent } from './containers/main/main.component';
import { BackupComponent } from './containers/backup/backup.component';
import { AddVendorComponent } from './containers/add-vendor/add-vendor.component';
import { VendorDetailsComponent } from './containers/vendor-details/vendor-details.component';
import { MoreDetailsComponent } from './containers/more-details/more-details.component';
import { AddContactComponent } from 'app/containers/crm/components/add-contact/add-contact.component';
import { InviteUserComponent } from 'app/containers/crm/components/invite-user/invite-user.component';
import { CompanyEditPageComponent } from 'app/containers/crm/components/company-edit-page/company-edit-page.component';
import { ContactPageComponent } from "app/containers/crm/components/contact-page/contact-page.component";
import { ContactListComponent } from "app/containers/crm/components/contactlist/contactlist.component";

import { vrmHeader,addVenderHeader, pospectVenderHeader, pbackupVenderHeader, 
    mainVenderHeader,vendorDetailsHeader,addContactHeader, moreDetailsHeader,companyEditHeader,
    addBusinessSubjectHeader, businessSubjectListHeader,CustomerShardHeader, contactPageHeader,contactListHeader, vendorProductsHeader } from 'app/core/models/header';

import { VendorProductsComponent } from "app/containers/vrm/components/vendor-products/vendor-products.component";

const vrmRoutes : Routes = [

    //for prospect
    {
        path:'prospect-vendor',
        component: ProspectComponent,
        data: vrmHeader
    },
    {
        path:'prospect-vendor/:ven_id',
        component: VendorDetailsComponent,
        data: vendorDetailsHeader
    },
    {
        path:'prospect-vendor/:ven_id/shared',
        component: InviteUserComponent,
        data: CustomerShardHeader
    },
    {
        path:'prospect-vendor/:ven_id/more_info',
        component: MoreDetailsComponent,
        data: moreDetailsHeader
    
    },
    {
        path:'prospect-vendor/:ven_id/vendor_edit',
        component: CompanyEditPageComponent,
        data: companyEditHeader
    },
    {
        path:'prospect-vendor/:ven_id/add-contact',
        component: AddContactComponent,
        data: addContactHeader
    },

    {
        path: 'prospect-vendor/:cusid/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },
    {
        path: 'prospect-vendor/:ven_id/showcase',
        loadChildren:'app/containers/showcase/showcase.module#ShowcaseModule',
    },
    {
        path: 'prospect-vendor/:ven_id/addresses',
        loadChildren:'app/containers/crm/components/address/address.module#AddressModule',
    },

    {
        path:"prospect-vendor/:ven_id/products",
        component: VendorProductsComponent,
        data: vendorProductsHeader
    },

    // for main
    {
        path:'main-vendor',
        component: MainComponent,
        data: vrmHeader
    },
    {
        path:'main-vendor/:ven_id',
        component: VendorDetailsComponent,
        data: vendorDetailsHeader
    },
    {
        path:'main-vendor/:ven_id/shared',
        component: InviteUserComponent,
        data: CustomerShardHeader
    },
    {
        path:'main-vendor/:ven_id/more_info',
        component: MoreDetailsComponent,
        data: moreDetailsHeader
        
    },
    {
        path:'main-vendor/:ven_id/vendor_edit',
        component: CompanyEditPageComponent,
        data: companyEditHeader
    },
    {
        path:'main-vendor/:ven_id/add-contact',
        component: AddContactComponent,
        data: addContactHeader
    },

    {
        path: 'main-vendor/:cusid/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },
    {
        path: 'main-vendor/:ven_id/purchase-orders/:vendor_company_id',
        loadChildren: 'app/containers/purchase-order/purchase-order.module#PurchaseOrderModule',
       
    },
    {
        path: 'main-vendor/:ven_id/showcase',
        loadChildren:'app/containers/showcase/showcase.module#ShowcaseModule',
    },
    {
        path: 'main-vendor/:ven_id/addresses',
        loadChildren:'app/containers/crm/components/address/address.module#AddressModule',
    },
    {
        path:"main-vendor/:ven_id/products",
        component: VendorProductsComponent,
        data: vendorProductsHeader
    },



    //for backup
    {
        path:'backup-vendor',
        component: BackupComponent,
        data: vrmHeader
    },
    {
        path:'backup-vendor/:ven_id',
        component: VendorDetailsComponent,
        data: vendorDetailsHeader

    },
    {
        path:'backup-vendor/:ven_id/shared',
        component: InviteUserComponent,
        data: CustomerShardHeader
    },
    
    {
        path:'backup-vendor/:ven_id/more_info',
        component: MoreDetailsComponent,
        data: moreDetailsHeader
    },
    {
        path:'backup-vendor/:ven_id/vendor_edit',
        component: CompanyEditPageComponent,
        data: companyEditHeader
    },
    
    {
        path:'backup-vendor/:ven_id/add-contact',
        component: AddContactComponent,
        data: addContactHeader
    },

    {
        path: 'backup-vendor/:cusid/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },
    {
        path: 'backup-vendor/:ven_id/showcase',
        loadChildren:'app/containers/showcase/showcase.module#ShowcaseModule',
    },
    {
        path: 'backup-vendor/:ven_id/addresses',
        loadChildren:'app/containers/crm/components/address/address.module#AddressModule',
    },
    {
        path:"backup-vendor/:ven_id/products",
        component: VendorProductsComponent,
        data: vendorProductsHeader
    },
    //add vendor
    
    {
        path:'add-vendor',
        component: AddVendorComponent,
        data: addVenderHeader
    },

    {
        path:"vendor/:ven_id/contacts/:conid",
        component: ContactPageComponent,
        data: contactPageHeader
    },
    {
        path:"vendor/:ven_id/contacts",
        component: ContactListComponent,
        data: contactListHeader
    },

]

@NgModule({
    imports:[
        RouterModule.forChild(vrmRoutes),
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class VrmRoutingModule{

}