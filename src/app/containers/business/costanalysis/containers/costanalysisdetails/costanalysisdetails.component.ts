import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CostAnalysisService } from 'app/core/services/cost-analysis.service';

@Component({
    selector:'costanalysisdetails',
    templateUrl:'costanalysisdetails.component.html',
    styleUrls:['costanalysisdetails.component.scss']
})

export class CostAnalysisDetailsComponent implements OnInit{

    currentLoginCompanyId;
    costAnalysisId;
    isLoading;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private costAnalysisService: CostAnalysisService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.costAnalysisId = this.route.snapshot.paramMap.get('costId');
        console.log(this.currentLoginCompanyId);
        console.log(this.costAnalysisId);
    }

    ngOnInit(){
        this.getCostAnalysisDetails();
    }

    getCostAnalysisDetails(){
        this.costAnalysisService.getCostAnalysis(this.currentLoginCompanyId, this.costAnalysisId).subscribe(
            res=>{
                console.log(res);
            }
        )
    }
}