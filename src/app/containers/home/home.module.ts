import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'app/components/avatar/avatar.module';
import { HomeRoutes } from './home.router';
import { CompanyLogoModule } from '../crm/components/company-logo/company-logo.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { HomeComponent } from './home.component';
import { GuestPageComponent } from './components/guest-page/guest-page.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { BusinessPanelComponent } from './components/business-panel/business-panel.component';
import { CurrentUserComponent } from './components/current-user/current-user.component';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';
import { LogoModule } from 'app/components/logo/logo.module';
import { InputCompanyNameComponent}  from './components/input-company-name/input-company-name.component';
import { CreateJoinCompanyComponent } from './components/create-join-company/create-join-company.component';
import { CreateCompanyComponent } from './components/create-company/create-company.component';
import { SearchCompanyComponent } from './components/search-company/search-company.component';
import { CompanyService } from '../../core/services/company.service';
import { DialogService } from 'app/core/services/dialog.service';
import { BusinessDashboardComponent } from './components/dashboard/dashboard.component';
import { IconComponent } from './components/dashboard/icon/icon.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';
import { FileBoxModule } from 'app/components/file-box/file-box.module';
import { ShortTextPipe } from './short-text.pipe';

import { MeetingService } from 'app/core/services/meeting.service';
import { DialogAlertModule } from '../../components/dialog-alert/dialog-alert.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterModule.forChild(HomeRoutes),
    AvatarModule,
    MatIconModule,
    ProfilePictureModule,
    LogoModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatTabsModule,
    MatSelectModule,
    CompanyLogoModule,
    SpinnerModule,
    MatDialogModule,
    ImageCropperModule,
    CropModalModule,
    FileBoxModule,
    DialogAlertModule
  ],
  declarations: [
    HomeComponent,
    GuestPageComponent,
    UserPageComponent,
    CurrentUserComponent,
    BusinessPanelComponent,
    InputCompanyNameComponent,
    SearchCompanyComponent,
    CreateJoinCompanyComponent,
    CreateCompanyComponent,
    BusinessDashboardComponent,
    IconComponent,
    ShortTextPipe,
    SidebarComponent
  ],
  providers:[
    CompanyService,
    DialogService,
    MeetingService
  ],
  exports: [
    HomeComponent,
  ]
})

export class HomeModule {}
