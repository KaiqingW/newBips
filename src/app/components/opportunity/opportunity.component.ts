import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector: 'opportunity',
    templateUrl:'opportunity.component.html',
    styleUrls:['opportunity.component.scss']
})

export class OpportunityComponent implements OnInit{

    currentLoginCompanyId;
    customer_id;
    isLoading:boolean;
    requestInfoList;

    constructor(
        private route: ActivatedRoute,
        private OpportunityService: OpportunityService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customer_id = this.route.snapshot.paramMap.get('cusid');
    }
    ngOnInit(){
        this.getRequestInfoList();
    }

    getRequestInfoList(){
        this.OpportunityService.getRequestInfoList(this.currentLoginCompanyId, this.customer_id).subscribe(
            res=>{
                this.requestInfoList = res.data;
                this.isLoading = false;
            }
        )
    }

    getValue(value){
        var key = "Please name this Project";
        return value.company_defined_columns.key;
    }
}
