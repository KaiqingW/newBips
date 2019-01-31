import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector:'opportunity-employee',
    templateUrl:'opportunity-employee.component.html',
    styleUrls:['opportunity-employee.component.scss']
})

export class OpportunityEmployeeComponent implements OnInit{

    isLoading: boolean = false;
    currentLoginCompanyId;
    opportunities;
    opportunityEmployee;
    employee_user_id ;
    latestStatus;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService: OpportunityService,
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.employee_user_id = this.route.snapshot.paramMap.get('opuserId');
        console.log(this.employee_user_id);
    }

    ngOnInit(){
        this.getOpportunityList();
        // this.getEmployeeLatestStatus()
    }


     getOpportunityList(){
        this.opportunityService.getOpportunityListByUserId(this.currentLoginCompanyId, this.employee_user_id).subscribe(
            res=>{
                this.opportunities = res;
                this.isLoading = false;
                console.log(res);
            }
        )
     }

     //for document 
    onReceivedFormData(fd){
        this.isLoading = true;
        // this.opportunityService.opportunitySetingAttachment(this.currentLoginCompanyId, 2, fd).subscribe(
        //     res=>{
        //         this.getOpportunitySetting();
        //     }
        // )
    }

    getEmployeeLatestStatus(){
        this.opportunityService.getEmployeeLatestStatus(this.currentLoginCompanyId, 1).subscribe(
            res=>{
                this.latestStatus = res;
                this.isLoading = false;
                console.log(res);
            }
        )
    }
}