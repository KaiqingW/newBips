import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { LeadService } from 'app/core/services/lead.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ToasterService } from 'app/core/services/toaster.service';
import { ZipCodeService } from 'app/core/services/zipcode.service';

@Component({
    selector:'add-address',
    templateUrl:'add-address.component.html',
    styleUrls:['add-address.component.scss']
})

export class AddAddressComponent implements OnInit{

    addAddressForm: FormGroup;
    zipcodeCtrl: FormControl;
    currentLoginCompanyId;
    customerId;
    isLoading;

    zipcode;
    city;
    state;
    country;
    allFieldRequied:boolean = false;
    fullAddress:boolean = false;
    zipcodeError:boolean = false;
    northAmerica:boolean = false ;
    selecteCountryCtrl: FormControl;
    countries = ['USA', "Canada", "Other"];
    showFullInputAddress:boolean = false;
    // addressType  = ['office', 'shipping', 'billing'];

    constructor(
        private fb: FormBuilder,
        private leadService: LeadService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private toasterService: ToasterService,
        private zipCodeService: ZipCodeService
    ){
        this.isLoading = true;
        this.createForm();
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customerId = this.route.snapshot.paramMap.get('cusid');
        if( !this.customerId){
            this.customerId = this.route.snapshot.paramMap.get('ven_id');
        }
        this.zipcodeCtrl = new FormControl();
        this.zipcodeCtrl.valueChanges.subscribe(
            (term)=> {
                this.onSearch(term);
            }
        )

        this.selecteCountryCtrl = new FormControl();
        this.selecteCountryCtrl.valueChanges.subscribe(
            (res)=>{
                if(res=="USA" || res =="Canada"){
                    this.northAmerica = true;
                }else{
                    this.showFullInputAddress = true
                }
            }
        )
    }

    ngOnInit(){
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                if (!this.addAddressForm.valid){
                    this.allFieldRequied = true;
                }
                if (this.addAddressForm.valid) {
                    this.allFieldRequied = false;
                    this.onSave();
                }
            });
        }, 0);
        this.isLoading = false;
    }

    createForm(){
        this.addAddressForm = this.fb.group({
            street1: [''],
            street2:[''],
            city: [''],
            state: [''],
            zipcode: [''],
            country:[''],
            type:['']
        })
    }

    onSave(){
        this.isLoading = true;
        this.leadService.addCustomerAddress(this.addAddressForm.value,this.currentLoginCompanyId,this.customerId).subscribe(
            res=>{
                this.location.back();
                this.toasterService.showToaster('Created Successfully!', '', 3000);
            }
        )
    }

    onSearch(value){
        if(value.length>=5){
            this.zipCodeService.getZipCodeAddress(value).subscribe(
                res=>{
                    // console.log(res);
                    if(res.results.length>0){
                        const formatt=res.results[0].formatted_address.split(', ');
                        const stetaAndZipcode = formatt[1].split(' ');
                        // console.log(res.results);
                        // console.log(formatt);
                        this.state = stetaAndZipcode[0];
                        this.zipcode =  stetaAndZipcode[1];
                        this.city = formatt[0];
                        this.country = formatt[2];
                        this.fullAddress = true;
                        this.zipcodeError = false;
                        this.allFieldRequied = false;
                    }else{
                        // console.log("err");
                        this.zipcodeError = true;
                        this.allFieldRequied = false;
                    }
                },
                err=>{
                    console.log(err);
                }
            )
        }
       
    }


}