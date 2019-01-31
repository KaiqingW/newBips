import { Component, OnInit } from "@angular/core";
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToasterService } from 'app/core/services/toaster.service';
import { Router } from '@angular/router';
import { Company, CompanyService } from '../../../../core/services/company.service';


@Component({
    selector:"search-company",
    templateUrl:"search-company.component.html",
    styleUrls:["search-company.component.scss"]
})

export class SearchCompanyComponent{
    companies$ : Observable<Company[]>;
    isLoading;
    companyName;

    constructor(
        private service: CompanyService,
        private route: ActivatedRoute,
        private router: Router,
    ){
        this.isLoading = true;
    }

    ngOnInit(){
        
    }

    searchCompany(name){
        this.service.searchCompany(name).subscribe(res=>{
            this.companies$ = res.data;  
            this.companyName =  name;  
        })
    }

    createCompany(){
        this.router.navigate([`/create-company-stepone`,{companyName: this.companyName}]);
    }
}