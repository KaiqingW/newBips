import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreState, User } from 'app/core/models';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { ToasterService } from 'app/core/services/toaster.service';
import * as AuthActions from 'app/core/actions/auth.action';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DialogService } from '../../../../core/services/dialog.service';
import { CommonService } from 'app/core/services/common.service';

@Component({
    selector: 'pwd-reset',
    templateUrl: 'pwd-reset.component.html',
    styleUrls: ['pwd-reset.component.scss']
})

export class PwdResetComponent {
    hide = false;
    user = new User();
    resetStep: number = 1;
    isLoading = false;
    reset_token : string;
    myForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        digits: new FormControl(''),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{6,}')]),
        confirmed_password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    constructor(
        private store: Store<StoreState>,
        private authService: AuthService,
        private router: Router,
        private toasterService: ToasterService,
        private dialogSService: DialogService,
        private commonService : CommonService
    ) {

    }

    onSubmit() {
        if (this.myForm.controls.password.value == this.myForm.controls.confirmed_password.value) {
        this.isLoading = true;
            this.authService.login({
                'email': this.user.email,
                'password': this.user.password
            }).subscribe(
                data => {
                this.authService.setOrcaToken(data.token);
                this.toasterService.showToaster('Logged In Successfully!', 'ok', 3000);
                this.store.dispatch(new AuthActions.LoginSuccess(data.user));
                this.isLoading = false;
                },
                err => {
                console.log(err);
                this.isLoading = false;
                this.toasterService.showToaster(err.error.message, '', 3000);
                }
            );
        }else{
            alert("Password and Confirmed Password should be consistent!");
        }
  
    }

    getDigits(){
        this.dialogSService.openCustomizedSureDialog('The reset service is temporarily down. Please contact 646-361-9789 to reset password.').subscribe(
            res => {
                
            }
        )
        // the service is temp down, latter will comment back.
        // this.authService.getDigitsToResetPwd(this.myForm.value.email).subscribe(
        //     (res) => {
        //         this.resetStep = 2;
        //         console.log('!');
        //     }
        // )
    }

    getToken(){
        this.resetStep = 3;
        this.authService.getTokenAfterGetDigits(this.myForm.value.email, this.myForm.value.digits).subscribe(
            (res) => {
                this.reset_token = res.reset_token;
                this.resetStep = 3;
            }
        )
    }

    getResetPassword(){
        if (this.myForm.controls.password.value == this.myForm.controls.confirmed_password.value) {
            this.isLoading = true;
            let value = {
                "emails": this.myForm.controls.email.value,
                "digits": this.myForm.controls.digits.value,
                "password": this.myForm.controls.password.value,
                "confirmed_password": this.myForm.controls.confirmed_password.value,
            }
            // console.log(value);
            this.commonService.checkResetCodeAndPassword(value).subscribe(
                res=>{
                    // console.log(res);
                    if(res){
                        this.router.navigateByUrl('/auth/login');
                    }else{
                        alert("Email or code not correct!");
                    }
                }
            )
            }else{
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

    resetPasswordSendEmail(){
        // console.log('send email');
        // console.log(this.myForm.controls.email.value);
        let value = {
                    "emails": [this.myForm.controls.email.value],
                    "content": "",
                    "subject": "Orcasmart code deliver"
                }
        // console.log(value);
        this.resetStep = 2;
        
        this.commonService.sendEmailWithoutToken(value).subscribe(
            res=>{

            }
        )
    }
}
