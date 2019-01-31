import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector: 'opportunity-detail',
    templateUrl:'opportunity-detail.component.html',
    styleUrls:['opportunity-detail.component.scss']
})

export class OpportunityDetailComponent implements OnInit{
    currentLoginCompanyId;
    customer_id;
    isLoading:boolean;
    requestInfo;
    requestInfo_id;
    customizedColumnObj;

    
    constructor(
        private route: ActivatedRoute,
        private opportunityService: OpportunityService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customer_id = this.route.snapshot.paramMap.get('cusid');
        this.requestInfo_id = this.route.snapshot.paramMap.get('oppid');
        // console.log(this.route);
    }

    ngOnInit(){
        this. getRqruestInfo();
    }

    getRqruestInfo(){
        this.opportunityService.getRequestInfo(this.currentLoginCompanyId, this.requestInfo_id).subscribe(
            res=>{
                this.requestInfo = res;
                console.log(this.requestInfo);
                this.definedColumnObj();
                this.isLoading = false;
            }
        )
    }

    definedColumnObj(){
        this.customizedColumnObj = Object.entries(this.requestInfo.company_defined_columns);
        // console.log(this.customizedColumnObj);
    }

    checkSectionName(value){
        if(value.includes('section_')){
            return true;
        } else{
            return false;
        }
    }

    getSectionName(value){
        return value.slice(8, value.length)
    }
}

