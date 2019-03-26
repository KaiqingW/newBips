import { NgModule,Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NavbarModule } from './components/navbar/navbar.module';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { AuthModule } from 'app/containers/auth/auth.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { AuthService } from 'app/core/services/auth.service';
import { AuthInterceptor } from 'app/core/services/auth.interceptor';
import { reducers } from './core/reducers';
import { DialogModule } from 'app/components/dialog/dialog.module';
import { DialogSureModule } from 'app/components/dialog-sure/dialog-sure.module';
import { DialogAlertModule } from 'app/components/dialog-alert/dialog-alert.module';
import { CustomizedDialogSureModule } from 'app/components/customized-dialog-sure/customized-dialog-sure.module';

import { CrmModule } from './containers/crm/crm.module';
import { ImageUploadModule } from "angular2-image-upload";
import{ SomeSharedService } from './core/services/someShared.service';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ShopManagementModule } from './containers/shop-management/shop-management.module';
// import { SharedModule } from 'app/core/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FooterModule } from './containers/footer/footer.module';

// Import the Froala Editor plugin.
import "froala-editor/js/froala_editor.pkgd.min.js";

// Import Angular plugin.
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { UMeditorModule } from 'ngx-umeditor';
@NgModule({
  imports: [
    AuthModule,
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    // SharedModule,
    NavbarModule.forRoot(),
    HttpClientModule,
    // import CrmModule, including crmrouter
    CrmModule,
    // forRoot is used for parent, like app.component
    RouterModule.forRoot(AppRoutes),
    StoreModule.forRoot(reducers),
    ImageUploadModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    }),
    MatSnackBarModule,
    MatDialogModule,
    SpinnerModule,
    DialogModule,
    DialogSureModule,
    DialogAlertModule,
    CustomizedDialogSureModule,
    FooterModule,
    ShopManagementModule,
    NgxMaskModule.forRoot(),
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    // JwtModule.forRoot({
    //   config: { 
    //     tokenGetter: tokenGetter,
    //     // whitelistedDomains: ['localhost:3001'],
    //     // blacklistedRoutes: ['localhost:3001/auth/']
    //   }
    // })
    UMeditorModule.forRoot()
  ],
  declarations: [
    AppComponent,
    
   ],
  providers: [
    AuthService,
    SomeSharedService,
    // JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent,]
})
export class AppModule { }
