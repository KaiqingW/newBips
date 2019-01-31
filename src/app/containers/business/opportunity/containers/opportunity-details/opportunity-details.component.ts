import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector:'opportunity-details',
    templateUrl:'opportunity-details.component.html',
    styleUrls:['opportunity-details.component.scss']
})

export class OpportunityDetailsComponent implements OnInit{
    firstLoading:boolean = false;
    isLoading : boolean = false;
    currentLoginCompanyId;
    opportunity_id;
    opportunityDetails;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService: OpportunityService,

    ){
        this.isLoading = true;
        this.firstLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.opportunity_id = this.route.snapshot.paramMap.get('oppId');
        console.log(this.opportunity_id);
    }

    ngOnInit(){
        this.getOpportunity();
    }

    getOpportunity(){
        this.opportunityService.getOpportunity(this.currentLoginCompanyId, this.opportunity_id).subscribe(
            res=>{
                console.log(res);
                this.opportunityDetails = res;
                this.firstLoading = false;
                this.isLoading = false;
            }
        )
    }

    //for document 
    onReceivedFormData(fd){
        this.isLoading = true;
        this.opportunityService.addOpportunityAttachment(this.currentLoginCompanyId, this.opportunity_id, fd).subscribe(
            res=>{
                this.getOpportunity();
            }
        )
    }

    toShareUserComponent(){
        this.router.navigate([`/company/${this.currentLoginCompanyId}/opportunity/add-shared-user`,{type:'opportunityDetails',oppId:this.opportunityDetails.id}]);
    }
}
