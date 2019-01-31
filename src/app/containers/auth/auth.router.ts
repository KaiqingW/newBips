import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PwdResetComponent } from './components/pwd-reset/pwd-reset.component';
import { AboutMeComponent } from './components/about-me/about-me.component';

import { resetPwdHeader, signUpHeader,loginHeader,aboutmeHeader } from 'app/core/models/header';

export const AuthRoutes: Routes = [
  { 
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
        data : loginHeader
      },
      { 
        path: 'login',
        component: LoginComponent,
        // data : loginHeader
      },
      { 
        path: 'signup',
        component: SignupComponent,
        data: signUpHeader
      },
      {
        path:'pwd_reset',
        component: PwdResetComponent,
        data : resetPwdHeader,
      },
      {
        path:'about_me',
        component: AboutMeComponent,
        data: aboutmeHeader
      }
    ] 
  }
];
