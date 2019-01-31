import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from 'app/core/services/contact.service';

@Component({
    selector:'contactlist',
    templateUrl: 'contactlist.component.html',
    styleUrls:['contactlist.component.scss']
})

export class ContactListComponent implements OnInit{
    currentLoginCompanyId;
    currentSelectedCustomerId;
    contactList;
    isLoading:boolean;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contactService: ContactService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.currentSelectedCustomerId = this.route.snapshot.paramMap.get('cusid');
        if(!this.currentSelectedCustomerId){
            this.currentSelectedCustomerId = this.route.snapshot.paramMap.get('ven_id');
        }
    }

    ngOnInit(){
        this.getContactList();

    }

    getContactList(){
        this.contactService.getContactsByCustomerId(this.currentLoginCompanyId, this.currentSelectedCustomerId).subscribe(
            res=>{
                this.contactList = res.data;
                this.isLoading = false;
                // console.log(res);
            },
            err=>{
                this.isLoading = false;
            }
        )
    }
}