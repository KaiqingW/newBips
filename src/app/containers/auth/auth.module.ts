import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { AuthRoutes } from './auth.router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { PanelCardModule } from 'app/containers/crm/components/panel-card/panel-card.module';

import { AuthService } from 'app/core/services/auth.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PwdResetComponent } from './components/pwd-reset/pwd-reset.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { DialogAlertModule } from '../../components/dialog-alert/dialog-alert.module';
import { DialogService } from '../../core/services/dialog.service';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterModule.forChild(AuthRoutes),
        SpinnerModule,
        PanelCardModule,
        DialogAlertModule,
    ],
    declarations: [
        AuthComponent,
        LoginComponent,
        SignupComponent,
        PwdResetComponent,
        AboutMeComponent
    ],
    providers: [
        AuthService,
        ToasterService,
        DialogService,
        DialogService
    ],
    exports:[
        LoginComponent
    ]
})

export class AuthModule { }
