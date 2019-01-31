import { Component, Input, OnInit,Inject } from '@angular/core';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';
import { Company } from 'app/core/models';
import { StoreState } from 'app/core/models';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as AuthActions from 'app/core/actions/auth.action';
import { AuthService } from 'app/core/services/auth.service';
import { CompanyService } from '../../../../core/services/company.service';
import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'business-panel',
    templateUrl: 'business-panel.component.html',
    styleUrls: ['business-panel.component.scss']
})

export class BusinessPanelComponent implements OnInit {
    auth: fromAuthReducer.State;
    auth$: Observable<fromAuthReducer.State>;
    companies:any;
    openCompanyApplication:number = -1;
    isLoading;
    currentUserAccount:string;
    password:string;
    showErroValue = false;
    data;
    selected_company_id;
    selected_company: Company;
    constructor(
        private store: Store<StoreState>,
        private authService: AuthService,
        private router: Router,
        private service: CompanyService,
        private dialogService: DialogService,
        // private dialog: MatDialog,
        private toasterService:ToasterService,
      ) {

      }
    
    ngOnInit(){
        
        if (this.authService.getOrcaToken()) {
            this.isLoading = true;
                this.authService.getCurrentUser().subscribe(
                    data => {
                    this.companies = data.user.employed_companies;
                    this.companies = this.companies.filter(company =>company.type != 0)

                    if(this.companies.length > 0){
                        this.selected_company = this.companies[0];
                        this.selected_company_id = +this.companies[0].id;
                    }
                    this.auth$ = this.store.select('auth');
                    this.auth$.subscribe(
                        (auth) => {
                            this.auth = auth;
                            this.data = {
                                name : this.auth.currentUser.email,
                                showError: this.showErroValue
                            }
                        }
                    );
                    this.isLoading = false;
                    },
                    err => {
                    this.isLoading = false;
                    }
                );
        }

        
    }

    selectCompany(company_id, company){
        this.selected_company_id = company_id;
        this.selected_company = company;
        this.isLoading =  false;
    }

    testFuntion(){
        let company_id = this.selected_company_id;
            this.currentUserAccount = this.auth.currentUser.email;
            //get the password
            
            if(this.password){
                this.authService.login({
                    'email':this.currentUserAccount,
                    'password':this.password
                }).subscribe(
                    res=>{
                        if(res.token){
                            this.isLoading = false;
                            this.router.navigateByUrl(`company/${company_id}/dashboard`).then(()=>{
                            localStorage.setItem('currentLoginCompanyId',company_id);
                            console.log(+localStorage.getItem("currentLoginCompanyId"));
                            this.showErroValue = false;
                            })
                        }
                      
                    },
                    err => {
                        this.dialogService.openAlertDialog(err.error.message);
                        this.isLoading = false;
                        this.toasterService.showToaster(err.error.message, '', 3000);
                        this.showErroValue = true;
                        // this.selectCompany(company_id, );
                      }
                )
            }
    }

}
