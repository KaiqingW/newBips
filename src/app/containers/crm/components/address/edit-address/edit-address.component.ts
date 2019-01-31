import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadService } from 'app/core/services/lead.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ToasterService } from 'app/core/services/toaster.service';

@Component({
    selector: 'edit-address',
    templateUrl:'edit-address.component.html',
    styleUrls: ['edit-address.component.scss']
})

export class EditAddressComponent implements OnInit{

    editAddressFrom: FormGroup;
    customerAddress;
    currentLoginCompanyId;
    customerId;
    addressId;
    isLoading;

    constructor(
        private fb: FormBuilder,
        private leadService : LeadService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private toasterService: ToasterService,

    ){
        this.isLoading = true;
        this.createForm();
        // console.log( this.editAddressFrom);
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customerId = this.route.snapshot.paramMap.get('cusid');
        if( !this.customerId){
            this.customerId = this.route.snapshot.paramMap.get('ven_id');
        }
        this.addressId = this.route.snapshot.paramMap.get('addId');;
    }

    ngOnInit(){

        this.leadService.getAddressById(this.addressId).subscribe(
            res=>{
                this.customerAddress = res;
                this.createForm();
                // console.log( this.editAddressFrom);
                this.isLoading = false;
            }
        );

        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                // console.log(this.editAddressFrom)
                if (this.editAddressFrom.valid) {
                    this.onSave();
                }
            });
        }, 0);
    }

    createForm(){
        this.editAddressFrom = this.fb.group({
            street1: [this.customerAddress ? this.customerAddress.street1:''],
            street2:[this.customerAddress ? this.customerAddress.street2:''],
            city: [this.customerAddress ? this.customerAddress.city:''],
            state: [this.customerAddress ? this.customerAddress.state:''],
            zipcode: [this.customerAddress ? this.customerAddress.zipcode:''],
            country:[this.customerAddress ? this.customerAddress.country:''],
            type:[this.customerAddress ? this.customerAddress.type:'']
        })
    }

    onSave(){
        this.isLoading = true;
        this.leadService.editCustomerAddress(this.editAddressFrom.value, this.addressId).subscribe(
            res=>{
                this.location.back();
                this.toasterService.showToaster('Created Successfully!', '', 3000);
            }
        )
    }
}