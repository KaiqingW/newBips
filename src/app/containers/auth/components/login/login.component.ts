import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreState, User } from 'app/core/models';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { ToasterService } from 'app/core/services/toaster.service';
import * as AuthActions from 'app/core/actions/auth.action';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent {

    user = new User();

    isLoading = false;

    myForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    constructor(
        private store: Store<StoreState>,
        private authService: AuthService,
        private router: Router,
        private toasterService: ToasterService,
        private dialogService: DialogService
    ) {

    }

    onSubmit() {
        this.isLoading = true;
        this.authService.login({
            'email': this.user.email,
            'password': this.user.password
          }).subscribe(
            data => {
              this.authService.setOrcaToken(data.token);
            //   console.log(jwtDecode(data.token).exp);
              this.toasterService.showToaster('Logged In Successfully!', 'ok', 3000);
              this.store.dispatch(new AuthActions.LoginSuccess(data.user));
              this.isLoading = false;
            },
            err => {
              this.dialogService.openAlertDialog(err.error.message);
              this.isLoading = false;
              this.toasterService.showToaster(err.error.message, '', 3000);
            }
          );
    }
    // gotoReset(){
    //     this.router.navigate(['/auth/pwd_reset']);
    // }

    getEmailErrorMessage() {
        return this.myForm.controls.email.hasError('required') ? 'You must enter a value' :
            this.myForm.controls.email.hasError('email') ? 'Not a valid email' :
            '';
    }

    getPasswordErrorMessage() {
        return this.myForm.controls.password.hasError('required') ? 'You must enter a value' :
            this.myForm.controls.password.hasError('minlength') ? 'Should be at least 6 characters' :
            '';
    }
    redirect() {
      this.router.navigate(['/auth/pwd_reset']);
    }
}
