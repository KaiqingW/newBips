import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ToasterService } from 'app/core/services/toaster.service';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyService } from '../../../../core/services/company.service';

@Component({
    selector:"input-company-name",
    templateUrl:"input-company-name.component.html",
    styleUrls:['input-company-name.component.scss']
})

export class InputCompanyNameComponent{
    
    companyForm: FormGroup;
    // company_name = new FormControl('');
    TcompanyName;
    isLoading;

    constructor(
        private fb:FormBuilder,
        private service :CompanyService,
        private router: Router,
        private route: ActivatedRoute,
        private toasterService: ToasterService,
    ){
            this.createForm();
            this.isLoading = true;
            this.TcompanyName= this.route.snapshot.paramMap.get('companyName');
    }
    ngOnInit(){
        this.isLoading = true;
        // create company
        setTimeout(()=>{
            this.isLoading = false;
            // const buttonClick= document.getElementById('header-submit-edit');
            // buttonClick.addEventListener('click', () =>{
            //     this.onSave();
            // })
        })
    }

    onSave(){
        // this.isLoading = true;
        // const name = this.companyForm.value.name;
        // this.service.addCompany({'name': name}).subscribe(res =>{
        //     this.router.navigateByUrl(`/home`).then(() =>{
        //         this.isLoading = false;
        //         this.toasterService.showToaster('Created Successful!', '', 3000)
        //     })
        // })
    }

    createForm(){
        this.companyForm = this.fb.group({
            name: ['']
            
        })
    }

    getCompanyName(name){
        this.router.navigate([`/create-join-company`,{companyName: name}])

    }
}