import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { VrmBaBaService } from '../../vrm.service';
import {LeadService } from '../../../../core/services/lead.service';


@Component({
    selector:'company-detail-page',
    templateUrl:'company-detail-page.component.html',
    styleUrls:['company-detail-page.component.scss']
})

export class CompanyDetailComponent{
    customer;
    currentLoginCompanyId;
    customerId;
    isLoading;

    constructor(
        // private vendorService : VendorService,
        private route: ActivatedRoute,
        private router: Router,
        // somebug with vendorservice
        private customerBaBaService: LeadService
        
    
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customerId = this.route.snapshot.paramMap.get('cusid');
    }
    
   ngOnInit(){
       this.customerBaBaService.getLead(this.currentLoginCompanyId, this.customerId).subscribe(
           res=>{
               this.customer = res;
               this.isLoading = false;
           }
       )
    
    }
}