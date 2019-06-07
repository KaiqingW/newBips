import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyLogoModule } from '../crm/components/company-logo/company-logo.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ImageCropperModule } from 'ng2-img-cropper';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { CompanySettingComponent } from './containers/company-setting/company-setting.component';
import { CompanyService } from '../../core/services/company.service';
import { AddEmployeeComponent } from 'app/containers/company/containers/add-employee/add-employee.component';
import { CompanyQuoteSettingComponent } from './containers/company-quote-setting/company-quote-setting.component';

import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';
import { DialogYesModule } from 'app/components/dialog-yes/dialog-yes.module';

import { DialogService } from 'app/core/services/dialog.service';
import { SettingDashboardComponent } from './containers/dashboard/dashboard.component';
import { LogoModule } from '../../components/logo/logo.module';
import { ProdcutCategorySettingComponent } from './containers/product-category-setting/product-category-setting.component';
import { ListTreeModule } from '../../components/list-tree/list-tree.component.module';
import { InventoryService } from '../../core/services/inventory.service';
import { HrService } from '../../core/services/hr.service';
import { CompanyCategorySettingComponent } from './containers/company-category-setting/company-category-setting.component';
import { CompanyDetailComponent } from './containers/company-detail/company-detail.component';
import { DiableColorDirectiveModule } from '../../directives/disable-color/disable-color.module';
import { PanelCardModule } from "app/containers/crm/components/panel-card/panel-card.module";
import { QuoteSettingService } from 'app/core/services/quote-setting.service';
import { ServiceCategorySettingComponent } from './containers/service-category-setting/service-category-setting.component';
import { SettingService } from 'app/core/services/setting.service';
import { DescriptionComponent } from 'app/components/list-tree/description/description.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { EditTextComponent } from 'app/components/list-tree/description/editText/editText';
import { EditImageComponent } from 'app/components/list-tree/description/editImage/editImage';
import { EditorModule } from 'app/components/editor/editor.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CompanyRoutingModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        MatIconModule,
        MatChipsModule,
        MatCardModule,
        MatSelectModule,
        MatButtonModule,
        ReactiveFormsModule,
        SpinnerModule,
        ImageCropperModule,
        CompanyLogoModule,
        CropModalModule,
        DialogYesModule,
        LogoModule,
        ListTreeModule,
        DiableColorDirectiveModule,
        PanelCardModule,
        MatGridListModule,
        EditorModule
    ],
    declarations: [
        CompanyComponent,
        CompanySettingComponent,
        AddEmployeeComponent,
        SettingDashboardComponent,
        ProdcutCategorySettingComponent,
        CompanyCategorySettingComponent,
        CompanyDetailComponent,
        CompanyQuoteSettingComponent,
        ServiceCategorySettingComponent,
        DescriptionComponent,
        EditTextComponent,
        EditImageComponent
    ],
    providers: [
        CompanyService,
        DialogService,
        InventoryService,
        HrService,
        QuoteSettingService,
        SettingService
    ]
})

export class CompanyModule {

}
