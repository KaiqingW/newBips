import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VrmBaBaService } from 'app/containers/vrm/vrm.service';
import { LeadService } from 'app/core/services/lead.service';

@Component({
    selector:'vendor-products',
    templateUrl:'vendor-products.component.html',
    styleUrls:['vendor-products.component.scss']
})

export class VendorProductsComponent implements OnInit{
    currentLoginCompanyId;
    vendorId;
    customerId;
    vendorInfo;
    productList;
    isLoading;


    constructor(
        private route: ActivatedRoute,
        private vrmService : VrmBaBaService,
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.vendorId = this.route.snapshot.paramMap.get('ven_id');

        if(!this.vendorId){
            this.customerId = this.route.snapshot.paramMap.get('cusid');
        }
    }
    ngOnInit(){
        if(this.vendorId){
            
            this.getVendorInformation(this.vendorId);
            this.getVendorProductList(this.vendorId);
        }else{
            this.getVendorInformation(this.customerId);
            this.GetCustomerProductList(this.customerId);
           
        }
    }

    getVendorInformation(value){
        this.vrmService.getVendor(this.currentLoginCompanyId, value).subscribe(
            res=>{
                this.vendorInfo = res;
                this.isLoading = false;
            }
        )
    }

    getVendorProductList(value){
        this.vrmService.getPrivateProductsByVendorId(this.currentLoginCompanyId, value).subscribe(
            res=>{
                this.productList = res.data;
                this.isLoading = false;
            }
        )
    }


    GetCustomerProductList(value){
        this.vrmService.getPrivateProductsByCustomerId(this.currentLoginCompanyId, value).subscribe(
            res=>{
                this.productList = res.data;
                this.isLoading= false;
            }
        )
    }
    
}