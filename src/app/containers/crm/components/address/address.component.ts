import { Component, OnInit } from '@angular/core';

import { Lead, LeadService } from 'app/core/services/lead.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector:'address',
    templateUrl:'address.component.html',
    styleUrls:['address.component.scss']
})

export class AddressComponent implements OnInit{
    currentLoginCompanyId;
    customerId;
    companyAddresses;
    isLoading;

    constructor(
        private leadService: LeadService,
        private route: ActivatedRoute,
        private router: Router,
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customerId = this.route.snapshot.paramMap.get('cusid');
        if( !this.customerId){
            this.customerId = this.route.snapshot.paramMap.get('ven_id');
        }
    }

    ngOnInit(){
        this.leadService.getLeadAddresses(this.currentLoginCompanyId,this.customerId).subscribe(
            res=>{
                this.companyAddresses = res.data;
                console.log( res.data);
                this.isLoading = false;
            })
    }
}