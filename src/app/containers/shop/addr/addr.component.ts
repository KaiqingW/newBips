import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LeadService } from 'app/core/services/lead.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ToasterService } from 'app/core/services/toaster.service';
import { ZipCodeService } from 'app/core/services/zipcode.service';
import { CartService } from 'app/core/services/cart.service';

@Component({
    selector: 'addr',
    templateUrl: 'addr.component.html',
    styleUrls: ['addr.component.scss']
})

export class AddrComponent implements OnInit {

    addAddressForm: FormGroup;
    zipcodeCtrl: FormControl;
    isLoading;
    vb_id;
    addrList;
    zipcode;
    city;
    state;
    country;
    defaultAddr;
    allFieldRequied: boolean = false;
    fullAddress: boolean = false;
    zipcodeError: boolean = false;
    hasAddr: boolean = false;

    constructor(
        private fb: FormBuilder,
        // private toasterService: ToasterService,
        private zipCodeService: ZipCodeService,
        private cartService: CartService,

    ) {
        this.isLoading = true;
        this.createNewAddrForm();
        this.zipcodeCtrl = new FormControl();
        this.zipcodeCtrl.valueChanges.subscribe(
            (term) => {
                this.onSearch(term);
            }
        )
    }


    ngOnInit() {
        this.getAddrList();
        // this.isLoading = false;
    }


    getAddrList() {
        this.isLoading = true;
        this.cartService.getMe().subscribe(
            (res) => {
                //console.log(res);
                for (let i = 0; i < res.user.employed_companies.length; i++) {
                    if (res.user.employed_companies[i].type == 0) {
                        this.vb_id = res.user.employed_companies[i].id;
                        //console.log(this.vb_id);
                        this.addrList = res.user.employed_companies[i].shipping_addresses;
                        this.defaultAddr = res.user.employed_companies[i].default_shipping_address;
                        //console.log(this.defaultAddr);
                        //console.log(this.addrList);
                        localStorage.setItem("addrId", null);
                        if (this.defaultAddr !== null) {
                            localStorage.setItem("addrId", this.defaultAddr.id);
                            this.hasAddr = true;
                        }
                        this.isLoading = false;
                    }
                }
            }
        )
    }

    createNewAddrForm() {
        this.addAddressForm = this.fb.group({
            first_name: '',
            last_name: '',
            address: this.fb.group({
                type: 'shipping',
                street1: '',
                street2: '',
                city: '',
                state: '',
                zipcode: '',
                country: '',
            })
        })

    }

    onSave() {
        //console.log("!", this.addAddressForm.value);
        if (!this.addAddressForm.valid) {
            this.allFieldRequied = true;
        }
        if (this.addAddressForm.valid) {
            this.isLoading = true;
            this.allFieldRequied = false;
            this.cartService.addAddr(this.vb_id, this.addAddressForm.value).subscribe(
                res => {
                    this.fullAddress = false;
                    this.addAddressForm.reset();
                    this.getAddrList();
                    this.isLoading = false;
                }
            )
        }

        // this.leadService.addCustomerAddress(this.addAddressForm.value, this.currentLoginCompanyId, this.customerId).subscribe(
        //     res => {
        //         this.location.back();
        //         this.toasterService.showToaster('Created Successfully!', '', 3000);
        //     }
        // )
    }

    onSelectAddr(value) {
        // //console.log(value);
        localStorage.setItem("addrId", value);
        this.hasAddr = true;
    }

    onDefaultAddr(value) {
        // //console.log(value);
        this.cartService.defaultAddr(value).subscribe(
            res => {
                //console.log(res);
                this.getAddrList();
            }
        )
    }

    onDeleteAddr(value) {
        // //console.log(value);
        this.cartService.deleteAddr(value).subscribe(
            res => {
                //console.log(res);
                this.getAddrList();
            }
        )
    }

    onSearch(value) {
        if (value.length >= 5) {
            this.zipCodeService.getZipCodeAddress(value).subscribe(
                res => {
                    //console.log(res);
                    if (res.results.length > 0) {
                        console.log(res.results[0].formatted_address);
                        const formatt = res.results[0].formatted_address.split(', ');
                        const stetaAndZipcode = formatt[1].split(' ');
                        // //console.log(res.results);
                        // //console.log(formatt);
                        this.state = stetaAndZipcode[0];
                        this.zipcode = stetaAndZipcode[1];
                        this.city = formatt[0];
                        if(formatt[2]=="USA"){this.country = "US";}else{this.country = formatt[2]}
                        this.fullAddress = true;
                        this.zipcodeError = false;
                        this.allFieldRequied = false;
                    } else {
                        // //console.log("err");
                        this.zipcodeError = true;
                        this.allFieldRequied = false;
                    }
                },
                err => {
                    //console.log(err);
                }
            )
        }

    }

}