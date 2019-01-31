import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validator, FormBuilder} from '@angular/forms'
import { Location } from '@angular/common';

import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector:'add-opportunity',
    templateUrl:'add-opportunity.component.html',
    styleUrls:['add-opportunity.component.scss']
})

export class AddOpportunityComponent implements OnInit{
    isLoading: boolean = false;
    currentLoginCompanyId;
    opportunityForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService: OpportunityService,
        private fb: FormBuilder,
        private location: Location
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.createOpportunityForm();
    }

    ngOnInit(){
        this.isLoading = false;
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                this.onSave();
            });
          }, 0);
    }

    createOpportunityForm(){
        this.opportunityForm = this.fb.group({
            name: [''],
            company_name: [''],
            company_id:['1'],
            description: ['']
        })
    }

    onSave(){
        this.isLoading = true;
        this.opportunityService.addOpportunity(this.currentLoginCompanyId, this.opportunityForm.value).subscribe(
            res=>{
               this.addOpportunityDefaultStatus(res.id);
               this.location.back();
            }
        )
    }

    addOpportunityDefaultStatus(opportunity_id){
        let defaultStatus = JSON.stringify([{"img":"","text":"this is the default status"}]);
        var request = {
            'oppportunity_id' : opportunity_id,
            'body':defaultStatus,
            'type': '0'
        }
        this.opportunityService.addOpportunityStatus(this.currentLoginCompanyId, opportunity_id, request).subscribe(
            res=>{
                console.log(res);
            }
        )
    }

}