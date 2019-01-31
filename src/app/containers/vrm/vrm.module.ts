import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VrmComponent } from './vrm.component'
import { VrmRoutingModule } from './vrm-routing.module';
import { AddVendorComponent } from './containers/add-vendor/add-vendor.component';
import { ProspectComponent } from './containers/prospect/prospect.component';
import { MainComponent } from './containers/main/main.component';
import { BackupComponent } from './containers/backup/backup.component';
import { VendorDetailsComponent } from './containers/vendor-details/vendor-details.component';
import { MoreDetailsComponent } from './containers/more-details/more-details.component';
import { AddContactModule } from 'app/containers/crm/components/add-contact/add-contact.module';
import { CompanyCardModule } from "app/containers/crm/components/company-card/company-card.module";
import { CompanyLogoModule } from "app/containers/crm/components/company-logo/company-logo.module";
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { PanelCardModule } from "app/containers/crm/components/panel-card/panel-card.module";
import { ImageCropperModule } from 'ng2-img-cropper';
import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';
import { ProductModalModule } from "app/containers/crm/components/product-modal/product-modal.module";
import { ImgModalModule } from 'app/components/img-modal/img-modal.module';
import { InviteUserModule } from 'app/containers/crm/components/invite-user/invite-user.module';
import { LogoModule } from 'app/components/logo/logo.module';
import { CompanyEditPageModule } from 'app/containers/crm/components/company-edit-page/company-edit-page.module';
import { CustomerAssignModule } from 'app/containers/crm/components/customer-assign/customer-assign.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

import { VrmBaBaService } from './vrm.service';
import { LeadService } from '../../core/services/lead.service';
import { ShortTextPipe }  from './short-text.pipe';

import { PSDialogComponent } from './containers/vendor-details/vendor-details.component';
import { AttchmentModule } from 'app/components/attachment/attachment.module';
import { DiableColorDirectiveModule } from '../../directives/disable-color/disable-color.module';
import { ContactBarModule } from 'app/containers/crm/components/contact-card/contact-bar.module';
import { NoteCardModule } from 'app/containers/crm/components/note-card/note-card.module';
import { ContactPageModule } from 'app/containers/crm/components/contact-page/contact-page.module';
import { ContactListModule } from 'app/containers/crm/components/contactlist/contactlist.module';
import { VendorProductModule } from 'app/containers/vrm/components/vendor-products/vendor-products.module';
import {NgxMaskModule} from 'ngx-mask';
@NgModule({
    imports :[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        VrmRoutingModule,
        CompanyCardModule,
        CompanyLogoModule,
        SpinnerModule,
        AddButtonModule,
        PanelCardModule,
        ImageCropperModule,
        CropModalModule,
        ProductModalModule,
        AddContactModule,
        ImgModalModule,
        InviteUserModule,
        LogoModule,
        AttchmentModule,
        CompanyEditPageModule,
        CustomerAssignModule,
        DiableColorDirectiveModule,
        NoteCardModule,
        
        MatInputModule,
        MatCardModule,
        MatSelectModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatChipsModule,
        ContactBarModule,
        ContactPageModule,
        ContactListModule,
        VendorProductModule,
        NgxMaskModule,
    ],
    declarations:[
        VrmComponent,
        ProspectComponent,
        BackupComponent,
        MainComponent,
        AddVendorComponent,
        VendorDetailsComponent,
        MoreDetailsComponent,
        ShortTextPipe,
        PSDialogComponent
        
    ],
    providers:[
        VrmBaBaService,
        LeadService

    ],
    exports:[
    ],
    entryComponents: [PSDialogComponent]
})

export class VrmModule{

}