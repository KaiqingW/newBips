import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

// import { VendorsService } from 'app/core/services/vendors.service';
import { VrmBaBaService } from '../../vrm.service';

@Component({
    selector:"more-details",
    templateUrl:"more-details.component.html",
    styleUrls:["more-details.component.scss"],
})

export class MoreDetailsComponent implements OnInit{
    Vendor;
    currentLoginCompanyId;
    vendorId;
    isLoading;

    constructor(
        // private vendorService : VendorService,
        private route: ActivatedRoute,
        private router: Router,
        // somebug with vendorservice
        private vrmBaBaService: VrmBaBaService
        
    
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.vendorId = this.route.snapshot.paramMap.get('ven_id');
    }
    
   ngOnInit(){
       this.vrmBaBaService.getVendor(this.currentLoginCompanyId, this.vendorId).subscribe(
           res=>{
               this.Vendor = res;
               this.isLoading = false;
           }
       )
    
    }

}