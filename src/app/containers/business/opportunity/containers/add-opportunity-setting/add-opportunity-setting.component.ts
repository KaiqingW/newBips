import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validator, FormBuilder } from "@angular/forms";
import { Location } from '@angular/common';
import { OpportunityService } from 'app/core/services/opportunity.service';

import { ImageService } from 'app/core/services/image.service';

@Component({
    selector:'add-opportunity-setting',
    templateUrl:'add-opportunity-setting.component.html',
    styleUrls:['add-opportunity-setting.component.scss']
})

export class AddOpportunitySettingComponent implements OnInit{

    isLoading: boolean = false;
    currentLoginCompanyId;
    opportunitySettingForm: FormGroup;
    imageId;
    fd = new FormData();


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private opportunityService: OpportunityService,
        private fb: FormBuilder,
        private location: Location,
        private imageService : ImageService

    ){

        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.createOpportunitySettingForm();

    }

    ngOnInit(){
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                    this.onSave();
            });
          }, 0);
    }

    createOpportunitySettingForm(){
        this.opportunitySettingForm = this.fb.group({
            company_name : [''],
            description: [''],
            images:['']
        })
    }

    onSave(){
        this.isLoading= true;
        this.opportunityService.addOpportunitySetting(this.currentLoginCompanyId, this.opportunitySettingForm.value).subscribe(
            res=>{
                this.addOpportunitySettingDefaultStatus(res.id)
                this.location.back();
            }
        )
    }

    addOpportunitySettingDefaultStatus(id){
        let defaultStatus = JSON.stringify([{"img":"","text":"this is the default status"}]);
        var request = {
            'oppportunity_id' : id,
            'body':defaultStatus,
            'type': '1'
        }
        this.opportunityService.addOpportunitySettingSatus(this.currentLoginCompanyId, id, request).subscribe(
            res=>{
                console.log(res);
            }
        )
    }

    onFileSelected(event){
        console.log(event);
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            console.log(file);
            this.fd.append('size', file.size);
            this.fd.append('type', file.type);
            this.fd.append('image', file, file.name);
            this.fd.append('description', file.type);
            console.log( this.fd);
            this.imageService.uploadImage(this.fd).subscribe(
                    res => {
                      console.log(res);
                      this.imageId = res.id;
                      this.isLoading = false;
                    },
                    err => {
                      this.isLoading = false;
                    }
                  );
        }
    }

// upload the image and get the id
  uploadImage() {
    // this.isLoading = true;
    // const formData = this.imageService.urltoFormData();
    // this.imageService.uploadImage(formData).subscribe(
    //     res => {
    //       this.imageId = res.id;
    //       this.isLoading = false;
         
    //     },
    //     err => {
    //       this.isLoading = false;

    //     }
    //   );
  }
}