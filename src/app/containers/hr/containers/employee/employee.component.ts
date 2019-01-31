import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';

import { CompanyService } from 'app/core/services/company.service';

@Component({
    selector:'employee',
    templateUrl:'./employee.component.html',
    styleUrls:['./employee.component.scss']
})

export class EmployeeComponent{
    isLoading;
    currentLoginCompanyId;
    companyEmployeeList;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        console.log(this.currentLoginCompanyId);
    }
    ngOnInit(){
        this.companyService.getCompany(this.currentLoginCompanyId).subscribe(
            res => {
                this.companyEmployeeList = res.employees;
                console.log(this.companyEmployeeList);
            })
    }
}