import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { OpportunityService } from 'app/core/services/opportunity.service';
import { CommonService } from 'app/core/services/common.service';
@Component({
    selector: 'opportunity-setting',
    templateUrl:'opportunity-setting.component.html',
    styleUrls:['opportunity-setting.component.scss']
})

export class OpportunitySettingComponent implements OnInit{

    isLoading:boolean = false;
    companyOpportunity;
    currentLoginCompanyId;
    alreadySetting: boolean = false;

    // fakedata
    testUser = {
        "id": 3,
        "type": 1,
        "first_name": "yadong",
        'last_name': 'Liu',
        "logo_url": "https://orcasmart.s3.us-east-2.amazonaws.com/images/MVqhf3bhIjgKCIaHNHvE3kMxegsM4zmozEbQZxXx.png",
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService: OpportunityService,
        private commonService: CommonService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        // console.log(this.currentLoginCompanyId);
    }
    ngOnInit(){
        this.checkOpportunitySettingList(); 
    }

    checkOpportunitySettingList(){
        this.opportunityService.getOpportunitySettingList(this.currentLoginCompanyId).subscribe(
            res=>{
                console.log(res);
                if(res.length>0){
                    console.log(res.length);
                    this. getOpportunitySetting();
                }else{
                    this.isLoading = false;
                    this.alreadySetting = false;
                }
            }
        )
    }
    getOpportunitySetting(){
        this.opportunityService.getOpportunitySetting(this.currentLoginCompanyId, 1).subscribe(
            res=>{
                this.companyOpportunity = res;
                console.log(res);
                this.isLoading = false;
                if(this.companyOpportunity){
                    // console.log( this.alreadySetting);
                    this.alreadySetting = true;
                }
            },
            err=>{
                this.isLoading = false;
            }
        )
    }

    //for document 
    onReceivedFormData(fd){
        this.isLoading = true;
        this.opportunityService.opportunitySetingAttachment(this.currentLoginCompanyId, 2, fd).subscribe(
            res=>{
                this.getOpportunitySetting();
            }
        )
    }

    toShareUserComponent(){
        this.router.navigate([`/company/${this.currentLoginCompanyId}/opportunity/add-shared-user`,{type:'opportunitySetting', oppSetId:this.companyOpportunity.id}]);
    }
}