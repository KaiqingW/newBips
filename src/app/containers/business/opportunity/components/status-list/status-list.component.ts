import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector:'status-list',
    templateUrl:'status-list.component.html',
    styleUrls:['status-list.component.scss']
})

export class StatusListComponent implements OnInit{
    isLoading:boolean = false;
    currentLoginCompanyId;
    settingStatusList;

    constructor(
        private opportunityService : OpportunityService,
        private router: Router,
        private route: ActivatedRoute,
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit(){
        this.getOpportunitySettingStatusList();
    }

    getOpportunitySettingStatusList(){
        this.opportunityService.getOpportunitySettingStatusList(this.currentLoginCompanyId).subscribe(
            res=>{
                this.settingStatusList = res;
                this.isLoading = false;
                console.log(res);
            }
        )
    }

}