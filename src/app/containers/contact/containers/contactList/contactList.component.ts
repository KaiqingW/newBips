import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { ToasterService } from 'app/core/services/toaster.service';
import { CompanyService } from 'app/core/services/company.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { ContactService } from 'app/core/services/contact.service';

// import { Observable } from 'rxjs/Observable';
// import { Store } from '@ngrx/store';
// import { StoreState } from 'app/core/models';

@Component({
    selector:'contactList',
    templateUrl:'contactList.component.html',
    styleUrls:['contactList.component.scss']
})

export class ContactListComponent{
    isLoading: Boolean = false;
    contactsList;
    vbCompanyId;
   
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private authService: AuthService,
        private toasterService: ToasterService,
        private dialogService: DialogService,
        private contactService: ContactService

    ){
        this.isLoading = true;
        this.getCurrentUser();
    }

    ngOnInit(){
        
    }

    getCurrentUser(){
        this.authService.getCurrentUser().subscribe(
            res=>{
                // console.log(res);
                if(res.user.vb_company == null){
                    this.router.navigateByUrl(`home`);
                }else{
                    this.vbCompanyId = res.user.vb_company.id;
                    this.getContacts();
                }
                
            }
        )
    }

    getContacts(){
        this.contactService.getPersonalContactList(this.vbCompanyId).subscribe(
            res=>{
                this.contactsList = res.data;
                this.isLoading = false;
            }
        )
    }

    //delete the emploee from the company
    deleteContact(contact){
    this.dialogService.openDialog().subscribe(result=>{
        if(result){
        this.isLoading = true;
        this.contactService.deletePersonalContact(this.vbCompanyId, contact.id).subscribe(res=>{
            const idx = this.contactsList.findIndex(n => n.id === contact.id);
            if (idx > -1) {
            this.contactsList.splice(idx, 1);
            this.isLoading = false;
            }
        })
        }
    })
    
    }
}

