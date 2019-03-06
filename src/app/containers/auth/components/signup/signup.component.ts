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
    selector: 'signup',
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.scss']
})

export class SignupComponent {
    user = new User();

    isLoading = false;

    myForm = new FormGroup({
        firstname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        lastname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{6,}')]),
        confirmed_password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    constructor(
        private store: Store<StoreState>,
        private authService: AuthService,
        private router: Router,
        private toasterService: ToasterService,
        private dialogService: DialogService
    ) { }

    onSubmit() {
        if (this.myForm.controls.password.value == this.myForm.controls.confirmed_password.value) {
            // this.isLoading = true;

            this.authService.signup({
                'email': this.user.email,
                'password': this.user.password,
                'first_name': this.user.first_name,
                'last_name': this.user.last_name
            }).subscribe(
                data => {
                    this.authService.setOrcaToken(data.token);
                    this.toasterService.showToaster('Signed up Successfully!', 'OK', 3000);
                    this.store.dispatch(new AuthActions.LoginSuccess(data.user));
                    this.isLoading = false;
                },
                err => {
                    this.dialogService.openAlertDialog(err.error.message);
                    this.toasterService.showToaster(err.error.errors ? err.error.errors.email : err.error.message, '', 3000);
                    this.isLoading = false;
                }
            );
        } else {
            alert("Password and Confirmed Password should be consistent!");
        }
    }

    getEmailErrorMessage() {
        return this.myForm.controls.email.hasError('required') ? 'You must enter a value' :
            this.myForm.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    getPasswordErrorMessage() {
        return this.myForm.controls.password.hasError('required') ? 'You must enter a value' :
            this.myForm.controls.password.hasError('minlength') ? 'Should be at least 6 characters' :
            this.myForm.controls.password.hasError('pattern') ? 'At least one uppercase and lowercase letter' :
                '';
    }

    getFirstnameErrorMessage() {
        return this.myForm.controls.firstname.hasError('required') ? 'You must enter a value' :
            this.myForm.controls.firstname.hasError('maxlength') ? 'Should be at most 20 characters' :
                '';
    }

    getLastnameErrorMessage() {
        return this.myForm.controls.lastname.hasError('required') ? 'You must enter a value' :
            this.myForm.controls.lastname.hasError('maxlength') ? 'Should be at most 20 characters' :
                '';
    }
}
