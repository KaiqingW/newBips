import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OpportunityService } from 'app/core/services/opportunity.service';


@Component({
    selector:'status-details',
    templateUrl:'status-details.component.html',
    styleUrls:['status-details.component.scss']
})

export class StatusDetailsComponent implements OnInit{
    isLoading : boolean = false;
    currentLoginCompanyId;
    opportunitySettingStatusId;
    statusId;
    statusDetails;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService : OpportunityService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        if(this.route.snapshot.paramMap.get('opsId')){
            this.statusId = this.route.snapshot.paramMap.get('opsId');
        }else{
            this.opportunitySettingStatusId = this.route.snapshot.paramMap.get('oppsId');
            console.log(this.opportunitySettingStatusId);
        }
       
    }
    ngOnInit(){
        if(this.statusId){
            this.getStatusDetails();
        }else{
            this.getOpportunitySettingStatusDetails();
        }
        
    }

    getStatusDetails(){
        this.opportunityService.getStatusDetails(this.currentLoginCompanyId, this.statusId).subscribe(
            res=>{
                // console.log(res);
                this.isLoading = false;
                this.statusDetails = res;
            }
        )
    }

    getOpportunitySettingStatusDetails(){
        this.opportunityService.getOpportunitySettingStatus(this.currentLoginCompanyId, this.opportunitySettingStatusId).subscribe(
            res=>{
                this.statusDetails = res;
                this.isLoading = false;
                console.log(res);
            }
        )
    }

    getFullName(value){
        return value.first_name + ' ' + value.last_name;
    }
}

