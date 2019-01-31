import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector:'shared-opportunity',
    templateUrl:'./shared-opportunities.component.html',
    styleUrls:['./shared-opportunities.component.scss']
})

export class SharedOpportunitiesComponent implements OnInit{
    isLoading: Boolean = false;
    currentLoginCompanyId;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService : OpportunityService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit(){

    }

    getOpportunityShared(){
        // this.opportunityService.opportunitySha
    }


}