import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector:'add-status',
    templateUrl:'./add-status.component.html',
    styleUrls:['./add-status.component.scss']
})

export  class AddStatusComponent implements OnInit{

    currentLoginCompanyId;
    opportunityId;
    opportunitySettingId;
    isLoading;
    addStatusForm;

    modalOpen = false;
    briefOpportunity;

    sharedOrNot;

    saveOnce: Boolean = true;
    imgsMap = new Map<number, string>();
    selectedImgIndex : number;
    selectedFile = null;


    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private dialogService : DialogService,
        private imageService : ImageService,
        private opportunityService : OpportunityService,
        private location : Location
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        if(this.route.snapshot.paramMap.get('oppId')){
            this.opportunityId = this.route.snapshot.paramMap.get('oppId');
        }
        this.createAddStatusForm();
        if(this.opportunityId){
            this.getBriefOpportunity();
        }else{
           this.isLoading = false;
            this.opportunitySettingId = 1;
        }
       
    }
    ngOnInit(){
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                if (!this.addStatusForm.invalid) {
                    this.onSave();
                }else {
                    let message = "Please fill all fields!";                    
                    this.dialogService.openAlertDialog(message);
                }
            });
        }, 0);
    }
    getBriefOpportunity(){
        this.opportunityService.getOpportunity(this.currentLoginCompanyId, this.opportunityId).subscribe(
            res=>{
                console.log(res);
                this.briefOpportunity= res;
                this.isLoading = false;
            }
        )
    }


    createAddStatusForm(){
        this.addStatusForm = this.fb.group({
            body: this.fb.array([
                this.initSubNote()
            ])
        })
    }

    
    initSubNote() {
        return this.fb.group({
            img: [''],
            text: ['']
        })
    }

    onFileSelected(event, index){
        if(event.target.files[0]){
            this.selectedImgIndex = index;
            this.selectedFile = <File>event.target.files[0];
            this.onAddImg(index);
        }
    }

    setImgInfoToFormData(){
        this.imgsMap.forEach((imgUrl, index) => {
            this.addStatusForm.value.body[index].img = imgUrl;
        });
    }

    onAddImg(index){
        const fd = new FormData();
        fd.append('image', this.selectedFile, this.selectedFile.name);
  
        this.imageService.uploadImage(fd).subscribe(
            (res) => {
                this.imgsMap.set(index, res.url);
            },
            (err) => {
            }
        );
    }

    onAddMore(){   
        const control = <FormArray>this.addStatusForm.controls['body'];
        control.push(this.initSubNote());
    }

    getImg(i){
        let res = this.imgsMap.get(i);
        return res;
    }

    openModal(){
        this.modalOpen =true;
    } 
  
    closeModal(){
        this.modalOpen =false;
    }
  
    onDelete(i){
        if(this.addStatusForm.controls.body['controls'].length > 1){
            const control = <FormArray>this.addStatusForm.controls['body'];
            control.removeAt(i);
            this.imgsMap.delete(i);
        }
    }

    onSave(){

        if(this.addStatusForm.valid && this.saveOnce){
            this.isLoading = true;
            this.saveOnce = false;
            this.setImgInfoToFormData();
            this.addStatusForm.value.body = JSON.stringify(this.addStatusForm.value.body);
            var request = {
                'oppportunity_id' : this.opportunityId,
                'body': this.addStatusForm.value.body,
                'type': '1'
            }
            if(this.opportunityId){
                this.opportunityService.addOpportunityStatus(this.currentLoginCompanyId, this.opportunityId, request).subscribe(
                    res=>{
                        this.location.back();
                    }
                )
            }else{
                this.opportunityService.addOpportunitySettingSatus(this.currentLoginCompanyId, this.opportunitySettingId, request ).subscribe(
                    res=>{
                        console.log(res);
                        this.location.back();
                    }
                )
            }
           
        }
    }
}