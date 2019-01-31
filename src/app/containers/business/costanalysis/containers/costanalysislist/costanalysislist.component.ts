import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CostAnalysisService } from 'app/core/services/cost-analysis.service';

@Component({
    selector: 'costanalysislist',
    templateUrl:"costanalysislist.component.html",
    styleUrls:['costanalysislist.component.scss']
})

export class CostAnlaysisListComponent implements OnInit{

    costAnalysisList = [];
    currentLoginCompanyId;
    isLoading;

    constructor(
        private route: ActivatedRoute,
        private costAnalysisService : CostAnalysisService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit(){
        this. getCostAnalysisList();
    }

    getCostAnalysisList(){
        this.costAnalysisService.getCostAnalysisList(this.currentLoginCompanyId).subscribe(
            res=>{
                this.costAnalysisList = res;
                this.isLoading = false;
            }
        )
    }

}