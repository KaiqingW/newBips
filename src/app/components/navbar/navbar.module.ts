import { NgModule, ModuleWithProviders  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'app/components/avatar/avatar.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NavbarComponent } from './navbar.component';
import { CurrentUserComponent } from './current-user/current-user.component';
import { IconComponent } from './icon/icon.component';

import { ToasterService } from 'app/core/services/toaster.service';
import { CommonService } from 'app/core/services/common.service';

import { NotesModule } from 'app/containers/notes/notes.module';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';
import { OneClickDirectiveModule } from '../../directives/one-click/one-click.module';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    RouterModule,
    MatMenuModule,
    AvatarModule,
    NotesModule,
    ProfilePictureModule,
    MatFormFieldModule,
    MatInputModule,
    OneClickDirectiveModule
  ],
  declarations: [
    NavbarComponent,
    CurrentUserComponent,
    IconComponent
  ],
  providers: [
    ToasterService, CommonService
  ],
  exports: [
    NavbarComponent
  ],
  
})

// export class NavbarModule {}
export class NavbarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NavbarModule,
      providers: [CommonService]
    };
  }
}