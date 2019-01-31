import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { CompanyService } from 'app/core/services/company.service';
@Component({
    selector:'candidate',
    templateUrl:'./candidate.component.html',
    styleUrls:['./candidate.component.scss']
})

export class CandidateComponent implements OnInit{
    currentLoginCompanyId;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    
    }
    
    ngOnInit(){}

}