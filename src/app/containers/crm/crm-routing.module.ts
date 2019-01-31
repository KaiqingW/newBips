import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrmComponent } from './crm.component';
import { CompanyEditPageComponent } from './components/company-edit-page/company-edit-page.component';
import { CompanyDetailComponent } from './components/company-detail-page/company-detail-page.component';
import { AddContactComponent } from './components/add-contact/add-contact.component';
import { InviteUserComponent } from './components/invite-user/invite-user.component';
import { ContactPageComponent } from "./components/contact-page/contact-page.component";
import { ContactListComponent } from "./components/contactlist/contactlist.component";
import { LeadComponent } from './containers/lead/lead.component';
import { LeadDetialsComponent } from './containers/lead/lead-detials/lead-detials.component';

import { PotentialComponent } from "./containers/potential/potential.component";
import { PotentialDetailsComponent } from './containers/potential/potential-details/potential-details.component';

import { AccountComponent } from "./containers/account/account.component";
import { AccountDetailsComponent } from './containers/account/account-details/account-details.component';

import { AddCustomerComponent } from "./containers/add-customer/add-customer.component";
// import { AccountSharedComponent } from './containers/account/account-share/account-shared.component';
import { VendorProductsComponent } from "app/containers/vrm/components/vendor-products/vendor-products.component";

import { addBusinessSubjectHeader, businessSubjectListHeader, crmHeader,leadCompanyHeader,leadCompanyEditHeader,leadCompanyDetailHeader,
        potentialCompanyDetailHeader, potentialCompanyHeader,potentialCompanyEditHeader,
        accountCompanyHeader, accountCompanyDetailsHeader,accountCompanyEditHeader,
        addCustomerHeader, addContactHeader, newOrderHeader,CustomerShardHeader, contactPageHeader,contactListHeader, vendorProductsHeader} from "../../core/models/header";

const crmRoutes : Routes = [
    // router for lead
    {
        path:'lead',
        component: LeadComponent,
        data: crmHeader,
    },        
    {
        path:'lead/:cusid',
        component: LeadDetialsComponent,
        data: leadCompanyHeader
    },
    {
        path:'lead/:cusid/shared',
        component: InviteUserComponent,
        data: CustomerShardHeader
    },
    {
        path:'lead/:cusid/company-edit',
        component: CompanyEditPageComponent,
        data: leadCompanyEditHeader
    },
    {
        path:'lead/:cusid/company-info',
        component: CompanyDetailComponent,
        data: leadCompanyDetailHeader
    },
    {
        path:'lead/:cusid/add-contact',
        component: AddContactComponent,
        data: addContactHeader
    },
    {
        path: 'lead/:cusid/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },

    {
        path: 'lead/:cusid/salesentity',
        loadChildren:'app/components/business-quota/business-quota.module#BusinessQuotasModule',
    },
    // {
    //     path: 'lead/:cusid/opportunities',
    //     loadChildren:'app/components/opportunity/opportunity.module#OpportunityModule',
    // },
    {
        path: 'lead/:cusid/addresses',
        loadChildren:'app/containers/crm/components/address/address.module#AddressModule',
    },
    {
        path:"lead/:cusid/products",
        component: VendorProductsComponent,
        data: vendorProductsHeader
    },

    // router for potential
    {
        path:'potential',
        component: PotentialComponent,
        data: crmHeader,
    },
    {
        path:'potential/:cusid',
        component: PotentialDetailsComponent,
        data: potentialCompanyHeader
    },
    {
        path:'potential/:cusid/shared',
        component: InviteUserComponent,
        data: CustomerShardHeader
    },
    {
        path:'potential/:cusid/company-edit',
        component: CompanyEditPageComponent,
        data: potentialCompanyEditHeader
    },
    {
        path:'potential/:cusid/company-info',
        component: CompanyDetailComponent,
        data: potentialCompanyDetailHeader
    },
    {
        path:'potential/:cusid/add-contact',
        component: AddContactComponent,
        data: addContactHeader
    },
    {
        path: 'potential/:cusid/salesentity',
        loadChildren:'app/components/business-quota/business-quota.module#BusinessQuotasModule',
    },
    {
        path: 'potential/:cusid/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },
    // {
    //     path: 'potential/:cusid/opportunities',
    //     loadChildren:'app/components/opportunity/opportunity.module#OpportunityModule',
    // },
    {
        path: 'potential/:cusid/addresses',
        loadChildren:'app/containers/crm/components/address/address.module#AddressModule',
    },

    //router for account
    {
        path:'account',
        component: AccountComponent,
        data: crmHeader
    },
    {
        path:'account/:cusid',
        component: AccountDetailsComponent,
        data: accountCompanyHeader
    },
    {
        path:'account/:cusid/shared',
        component: InviteUserComponent,
        data: CustomerShardHeader
    },
    {
        path:'account/:cusid/company-edit',
        component: CompanyEditPageComponent,
        data: accountCompanyEditHeader
    },
    
    {
        path:'account/:cusid/company-info',
        component: CompanyDetailComponent,
        data: potentialCompanyDetailHeader
    },
    {
        path:'account/:cusid/add-contact',
        component: AddContactComponent,
        data: addContactHeader
    },
    {
        path: 'account/:cusid/salesentity',
        loadChildren:'app/components/business-quota/business-quota.module#BusinessQuotasModule',
    },

    {
        path: 'account/:cusid/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },

    {
        path: 'account/:cusid/purchase-orders',
        loadChildren: 'app/containers/purchase-order/purchase-order.module#PurchaseOrderModule',
    },
    // {
    //     path: 'account/:cusid/opportunities',
    //     loadChildren:'app/components/opportunity/opportunity.module#OpportunityModule',
    // },
    {
        path: 'account/:cusid/addresses',
        loadChildren:'app/containers/crm/components/address/address.module#AddressModule',
    },

    /**************************router for account shared ********************************** */
    // {
    //     path:'account-shared',
    //     component: AccountComponent,
    //     data: crmHeader
    // },
    // {
    //     path:'account-shared/:cusid',
    //     component: AccountDetailsComponent,
    //     data: accountCompanyHeader
    // },
    //router for add customer
    {
        path:"customer/:cusid/contacts/:conid",
        component: ContactPageComponent,
        data: contactPageHeader
    },
    {
        path: 'customer/:cusid/contacts',
        component: ContactListComponent,
        data: contactListHeader
    },
    {
        path:'add-customer',
        component: AddCustomerComponent,
        data: addCustomerHeader
    },

]

@NgModule({
    imports:[
        RouterModule.forChild(crmRoutes),
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class CrmRoutingModule{

}