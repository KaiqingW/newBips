import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleComponent } from './people.component';
import { RouterModule } from '@angular/router';
import { PeopleRoutes } from './people.router';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';
import { MatCardModule } from '@angular/material/card';
import { PeopleProfileComponent } from './components/people-profile/people-profile.component';
import { LogoModule } from 'app/components/logo/logo.module';

import { UserService } from 'app/core/services/user.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { LoggingUserService } from 'app/core/services/logging-user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PeopleRoutes),
    RouterModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule, ReactiveFormsModule,
    SpinnerModule,
    ProfilePictureModule,
    MatCardModule,
    LogoModule
  ],
  declarations: [
    PeopleComponent,
    PeopleProfileComponent,
  ],
  providers: [
    UserService,
    ToasterService,
    LoggingUserService
  ]
})
export class PeopleModule { }