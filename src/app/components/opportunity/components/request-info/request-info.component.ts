import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { OpportunityService } from 'app/core/services/opportunity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector:'request-info',
    templateUrl:'request-info.component.html',
    styleUrls:['request-info.component.scss']
})

export class RequestInfoComponent implements OnInit{

    currentLoginCompanyId;
    customizedFieldName;
    isLoading:boolean;
    requestInfoForm: FormGroup;
    request_defined_columns = [];
    request_defined_columns_obj = {};
    testValue:number = 0;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService: OpportunityService,
        private fb : FormBuilder
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    }
    ngOnInit(){
        this.getRequestInfo();
    }
    //get requests_info list
    getRequestInfo(){
        this.opportunityService.getRequestInfoCustomizedFiled(this.currentLoginCompanyId, 'requests_info').subscribe(
            res=>{
                this.customizedFieldName = res;
                this.isLoading = false;
            }
        )
    }

    createRequestInfoForm() {
        this.requestInfoForm = this.fb.group({
            sales_rep_name:[''],
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
            }
        )
    }

    getControlType(company_defined_column) {
        let max = company_defined_column.max_length;
        return ['', [Validators.required, Validators.maxLength(max)]];
    }


}