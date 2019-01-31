import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { OpportunityService } from 'app/core/services/opportunity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector:'add-opportunity',
    templateUrl:'add-opportunity.component.html',
    styleUrls:['add-opportunity.component.scss']
})

export class AddOpportunityComponent implements OnInit{
    
    currentLoginCompanyId;
    customer_id;
    customizedFieldName;
    isLoading:boolean;
    requestInfoForm: FormGroup;
    request_defined_columns = [];
    request_defined_columns_obj = {};
    testValue:number = 0;
    imgs = [];


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService: OpportunityService,
        private fb : FormBuilder,
        private location : Location
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customer_id = this.route.snapshot.paramMap.get('cusid');
        console.log(this.customer_id);
        this.createRequestInfoDefinedColumnObj();
        this.getRequestInfo();
    }
    ngOnInit(){
        
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                
              this.onSave();
            });
          }, 0);
    }
    //get requests_info list
    getRequestInfo(){
        this.opportunityService.getRequestInfoCustomizedFiled(this.currentLoginCompanyId, 'requests_info').subscribe(
            res=>{
                this.customizedFieldName = res;
                this.isLoading = false;
                this.sortObjectArray(this.customizedFieldName);
            }
        )
    }

    createRequestInfoForm() {
        this.requestInfoForm = this.fb.group({
            customer_id:[''],
            address_id:[''],
            project_name:[''],
            customer_name: [''],
            contact_name: [''],
            phone_number: [''],
            email_address: [''],
            sales_rep_name:[''],
            request_date:[''],
            approve_by:[''],
            approve_date: [''],
            request_defined_columns :this.fb.group(this.request_defined_columns_obj),
        }) 
    }

    createRequestInfoDefinedColumnObj(){
        this.opportunityService.getRequestInfoCustomizedFiled(this.currentLoginCompanyId, 'requests_info').subscribe(
            res=>{
                this.request_defined_columns = res;
                for (var i = 0; i<res.length; i++){
                    let name = res[i].column_name;
                    this.request_defined_columns_obj[name] = this.getControlType(res[i]);
                }
                this.createRequestInfoForm();
            }
        )
    }

    getControlType(company_defined_column) {
        let max = company_defined_column.max_length;
        return ['', [Validators.required, Validators.maxLength(max)]];
    }

    checkSectionName(value){
        return value.includes('section');
    }

    onSave(){
        this.opportunityService.addRequestInfo(this.currentLoginCompanyId, this.customer_id, this.requestInfoForm.value).subscribe(
            res=>{
                console.log(res);
                this.location.back();
            }
        )
    }

    sortObjectArray(array) {
        // sort customizedFieldName according to the order
        function compare (a, b) {
            if (a.sort_order < b.sort_order) {
            return -1;
            }
            if (a.sort_order > b.sort_order) {
            return 1;
            }
            return 0;
        }
        array.sort(compare);
    }

    onReceiveImgs(imgs) {
        imgs = imgs.map((img) => {
            return img['id'];
        })
        this.imgs = imgs;
    }

}