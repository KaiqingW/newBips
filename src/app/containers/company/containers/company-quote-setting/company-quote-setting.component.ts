import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { QuoteSettingService } from 'app/core/services/quote-setting.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { SearchService } from 'app/core/services/search.service';


@Component({
    selector:'company-quote-setting',
    templateUrl:'company-quote-setting.component.html',
    styleUrls:['company-quote-setting.component.scss']
})

export class CompanyQuoteSettingComponent implements OnInit{ 
    currentLoginCompanyId;
    isLoading: boolean = false;
    paytermList;
    permissionList;
    shipviaList;
    quoteSettingForm;
    addQuoteSettingModal:boolean = false;
    addPaytermControl:boolean = false;
    addShipViaControl:boolean = false;
    addPermissionControl:boolean = false;
    // @ViewChild('scrollposition',{read:ElementRef}) public scrollposition: ElementRef;
    inputValueCtrl;
    inputValue;
    employeeEmailList;

    constructor(
        private quoteSettingService: QuoteSettingService,
        private route: ActivatedRoute,
        private location : Location,
        private fb: FormBuilder,
        private searchService: SearchService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = +this.route.snapshot.paramMap.get('cid');
        this.createQuoteSettingForm();

        this.inputValueCtrl = new FormControl(); //inputValueCtrl is writing for get input value
        this.inputValueCtrl.valueChanges.subscribe(
            (res) => { 
                this.onSearchEmployee(res);
             }
        )
    }

    ngOnInit(){
        this.getQuoteSettingPayterm();
        this.getQuoteSettingShipVia();
        this.getQuoteSettingPermission();
    }

    createQuoteSettingForm(){
        this.quoteSettingForm = this.fb.group({
            payterm:[''],
            ship_via:[''],
            approved_permission:['']
        })
    }

    getQuoteSettingPayterm(){
        this.quoteSettingService.quotesSettingGetPayterm(this.currentLoginCompanyId).subscribe(
            res=>{
                // console.log(res);
                this.paytermList = res;
                this.isLoading = false;
                // console.log(res[0]);
                // console.log(this.paytermList.length);
            }
        )
    }

    onSearchEmployee(value){
        this.searchService.searchCompanyEmployee(value, this.currentLoginCompanyId).subscribe(
            res=>{
                // console.log(res);
                this.employeeEmailList = res;
            }
        )
    }

    assignedUserSlected(value){
        this.quoteSettingForm.value.approved_permission = value.id
        // console.log(this.quoteSettingForm.value);
        // console.log(value);
    }

    getQuoteSettingShipVia(){
        this.quoteSettingService.quotesSettingGetShipVia(this.currentLoginCompanyId).subscribe(
            res=>{
                this.shipviaList = res;
                this.isLoading = false;
                // console.log(res);
            }
        )
    }

    getQuoteSettingPermission(){
        this.quoteSettingService.quotesSettingGetPermission(this.currentLoginCompanyId).subscribe(
            res=>{
                this.permissionList = res;
                this.isLoading = false;
                // console.log(res);
            }
        )
    }

    addPeyterm(){
        this.addQuoteSettingModal = true;
        this.addPaytermControl = true;
    }

    addShipVia(){
        this.addQuoteSettingModal = true;
        this.addShipViaControl = true;
    }

    addPermission(){
        this.addQuoteSettingModal = true;
        this.addPermissionControl = true;
    }

    closeQuoteSettingModal(){
        this.addQuoteSettingModal = false;
        this.addPaytermControl = false;
        this.addPermissionControl = false;
        this.addShipViaControl = false;
    }

    onSave(){
        this.quoteSettingService.quoteSettingAdd(this.currentLoginCompanyId, this.quoteSettingForm.value).subscribe(
            res=>{
                // console.log(res);
                this.getQuoteSettingPayterm();
                this.getQuoteSettingShipVia();
                this.getQuoteSettingPermission();
            }
        )
        this.closeQuoteSettingModal();
        this.createQuoteSettingForm();
    }

    deleteQuoteSetting(value){
        this.isLoading = true;
        this.quoteSettingService.quoteSettingDelete(this.currentLoginCompanyId, value).subscribe(
            res=>{
                this.getQuoteSettingPayterm();
                this.getQuoteSettingShipVia();
                this.getQuoteSettingPermission();
            }
        )
    }
    

}