import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { CompanyService } from 'app/core/services/company.service';

@Component({
    selector:'resume',
    templateUrl:'./resume.component.html',
    styleUrls: ['./resume.component.scss']
})

export class ResumeComponent implements OnInit{
    currentLoginCompanyId;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
 
    }
    ngOnInit(){

    }
}