import { Component, OnInit } from "@angular/core";
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToasterService } from 'app/core/services/toaster.service';

import { Company, CompanyService } from '../../../../core/services/company.service';

@Component({
    selector:'create-join-company',
    templateUrl:'create-join-company.component.html',
    styleUrls:['create-join-company.component.scss']
})

export class CreateJoinCompanyComponent{
    companyName;
    companies$ : Observable<Company[]>;
    isLoading;

    constructor(
        private service: CompanyService,
        private route: ActivatedRoute,
        private router: Router,
    ){
        this.companyName= this.route.snapshot.paramMap.get('companyName');
        this.isLoading = true;
    }

    ngOnInit(){
        this.searchCompany(this.companyName);
    }

    searchCompany(companyName){
        this.service.searchCompany(companyName).subscribe(res=>{
            this.companies$ = res.data;
        })

    }
    createCompany(){
        this.router.navigate([`/create-company`,{companyName: this.companyName}])
    }
}
