import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrmRoutingModule } from './crm-routing.module';

import { CompanyCardModule } from "./components/company-card/company-card.module";
import { PanelCardModule } from "./components/panel-card/panel-card.module";
import { CompanyLogoModule } from "./components/company-logo/company-logo.module";
import { ProductModalModule } from "./components/product-modal/product-modal.module";
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { CompanyEditPageModule } from './components/company-edit-page/company-edit-page.module';
import { AddContactModule } from './components/add-contact/add-contact.module';
import { InviteUserModule } from './components/invite-user/invite-user.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { LogoModule } from 'app/components/logo/logo.module';
import { ContactPageModule } from './components/contact-page/contact-page.module';
import { AttchmentModule } from 'app/components/attachment/attachment.module';
import { AddressModule } from './components/address/address.module';
import { CustomerAssignModule } from './components/customer-assign/customer-assign.module';
import { SelectBarModule } from '../../components/select-bar/select-bar.module';
import { NoteCardModule } from './components/note-card/note-card.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { LeadComponent } from './containers//lead/lead.component';
import { LeadDetialsComponent } from './containers//lead/lead-detials/lead-detials.component';
import { LeadService } from '../../core/services/lead.service';
import { StreetTypesService } from 'app/core/data/street.service';
import { ZipCodeService } from 'app/core/services/zipcode.service';
import { CompanyService } from '../../core/services/company.service';
import { SearchService } from 'app/core/services/search.service';

import { PotentialComponent } from "./containers/potential/potential.component";
import { PotentialDetailsComponent } from './containers/potential/potential-details/potential-details.component';
import { PotentialService } from '../../core/services/potential.service';

import { AccountComponent } from "./containers/account/account.component";
import { AccountDetailsComponent } from './containers/account/account-details/account-details.component';
import { AccountService } from '../../core/services/account.service';
import { AuthService } from '../../core/services/auth.service';
import { VrmBaBaService } from 'app/containers/vrm/vrm.service';

import { CrmComponent } from './crm.component';
import { AddCustomerComponent } from './containers/add-customer/add-customer.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';
import { BusinessNotesModule } from 'app/components/business-notes/business-notes.module';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';

import { AddAttchmentModule } from 'app/components/add-attachement/add-attachment.module';
import { AddCrmOpportunityModule } from 'app/components/add-crm-opportunity/add-crm-opportunity.moduls';
import { AddProductModule } from 'app/components/add-product/add-product.module';
import { ShortTextPipe }  from './short-text.pipe';
import { PSDialogComponent } from './containers/account/account-details/account-details.component';
import { NewOrderComponent } from 'app/containers/purchase-order/components/new-order/new-order.component';
import { CompanyDetailPageModule } from 'app/containers/crm/components/company-detail-page/company-detail-page.module';
import { DialogAlertComponent } from '../../components/dialog-alert/dialog-alert.component';
import { DialogAlertModule } from '../../components/dialog-alert/dialog-alert.module';
import { ContactBarModule } from './components/contact-card/contact-bar.module';
import { DiableColorDirectiveModule } from '../../directives/disable-color/disable-color.module';
import { ContactListModule } from './components/contactlist/contactlist.module';
import { ReadMoreModule } from 'app/containers/business-meeting/components/read-more/read-more.module';
import { VendorProductModule } from 'app/containers/vrm/components/vendor-products/vendor-products.module';
// import { AccountSharedComponent } from './containers/account/account-share/account-shared.component';
import {NgxMaskModule} from 'ngx-mask';
@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        CrmRoutingModule,
        SpinnerModule,
        CompanyCardModule,
        PanelCardModule,
        CompanyLogoModule,
        MatCardModule,
        MatIconModule,
        ProductModalModule,
        CompanyEditPageModule,
        AddButtonModule,
        MatInputModule,
        ReactiveFormsModule,
        ImageCropperModule,
        CropModalModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatChipsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        InviteUserModule,
        AddContactModule,
        BusinessNotesModule,
        ImgModalModule,
        AddAttchmentModule,
        AddCrmOpportunityModule,
        AddProductModule,
        LogoModule,
        ProfilePictureModule,
        ContactPageModule,
        AttchmentModule,
        CompanyDetailPageModule,
        AddressModule,
        DialogAlertModule,
        ContactBarModule,
        DiableColorDirectiveModule,
        CustomerAssignModule,
        SelectBarModule,
        NoteCardModule,
        ContactListModule,
        ReadMoreModule,
        VendorProductModule,
        NgxMaskModule,
    ],
    declarations:[
        CrmComponent,
        LeadComponent,
        LeadDetialsComponent,
        PotentialComponent,
        PotentialDetailsComponent,
        AccountComponent,
        AccountDetailsComponent,
        AddCustomerComponent,
        ShortTextPipe,
        PSDialogComponent,
 
    ],
    providers: [
        LeadService,
        AccountService,
        PotentialService,
        StreetTypesService,
        ZipCodeService,
        CompanyService,
        AuthService,
        SearchService,
        VrmBaBaService
    ],
    exports:[
        
    ],
    entryComponents: [PSDialogComponent]
})

export class CrmModule{

}