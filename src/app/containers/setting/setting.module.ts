import { NgModule } from '@angular/core';
import { SettingComponent } from './setting.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingRoutes } from './setting.router';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'app/components/avatar/avatar.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';

import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';

import { NotesService } from 'app/core/services/notes.service';
import { UserService } from 'app/core/services/user.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { ImageService } from 'app/core/services/image.service';

import { ProfileComponent } from './components/profile/profile.component';

import { ImageCropperModule } from 'ng2-img-cropper';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';

@NgModule({
  imports: [
    RouterModule.forChild(SettingRoutes),
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    AvatarModule,
    SpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    CropModalModule,
    ProfilePictureModule,
    MatRadioModule,
    MatChipsModule
  ],
  declarations: [
    SettingComponent,
    ProfileComponent,
  ],
  providers: [
    NotesService,
    UserService,
    ToasterService,
    ImageService
  ]
})

export class SettingModule {

}
