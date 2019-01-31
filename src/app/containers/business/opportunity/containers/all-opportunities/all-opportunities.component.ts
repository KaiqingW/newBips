import {Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { OpportunityService } from 'app/core/services/opportunity.service';


@Component({
    selector:'all-opportunities',
    templateUrl:'./all-opportunities.component.html',
    styleUrls:['./all-opportunities.component.scss']
})

export class AllOpportunitiesComponent implements OnInit{

    filterOpportunities;
    currentLoginCompanyId;
    isLoading: boolean = false;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService: OpportunityService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');

    }

    ngOnInit(){
        this.getAllOpportunities();
    }

    getAllOpportunities(){
        this.opportunityService.getAllOpportunies(this.currentLoginCompanyId).subscribe(
            res=>{
                this.filterOpportunities = res;
                this.isLoading = false;
                console.log(res);
            }
        )
    }

    searchOpportunities(){

    }

    getUrgentOpportunities(){

    }

    getPendingOpportunities(){

    }

    getInprogressOpportunities(){

    }

    getFinishedOpportunities(){

    }

    getFailedOpportunities(){
        
    }

}