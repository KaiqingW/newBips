import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'app/core/services/company.service';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector:'human-details',
    templateUrl:'human-details.component.html',
    styleUrls:['human-details.component.scss']
})

export class HumanDetailsComponent{
    curerntHuman;
    currentLoginCompanyId;
    currentHuman_id;
    showData:boolean = false;
    showChart:boolean = true;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.currentHuman_id = this.route.snapshot.paramMap.get('humanid');
        
    }
    ngOnInit(){
        this.companyService.getEmployee(this.currentLoginCompanyId, this.currentHuman_id).subscribe(
            res=>{
                this.curerntHuman = res;
                console.log(this.curerntHuman);
            }
        )
    }

    showChartFun(){
        this.showData = false;
        this.showChart = true;
    }
    showDataFun(){
        this.showData = true;
        this.showChart = false;
    }
}