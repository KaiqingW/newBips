import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector: 'add-comment',
    templateUrl:'./add-comment.component.html',
    styleUrls:['./add-comment.component.scss']
})

export class AddCommentComponent implements OnInit{
    currentLoginCompanyId;
    opportunitySettingStatusId;
    statusId;
    isLoading;
    addCommentForm;
    modalOpen = false;
    briefStatus;

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
        if(this.route.snapshot.paramMap.get('opsId')){
            this.statusId = this.route.snapshot.paramMap.get('opsId');
        }else{
            this.opportunitySettingStatusId = this.route.snapshot.paramMap.get('opsetsId');
        }

        if(this.statusId){
            this.getBriefStatus();
        }else{
            this.getOpportunitySettingStatus();
  
        }
        this.createAddCommentFrom();
        
    }

    ngOnInit(){
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                if (!this.addCommentForm.invalid) {
                    this.onSave();
                }else {
                    let message = "Please fill all fields!";                    
                    this.dialogService.openAlertDialog(message);
                }
            });
        }, 0);
    }

    createAddCommentFrom() {
        this.addCommentForm = this.fb.group({
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

    getBriefStatus(){
        this.opportunityService.getStatusDetails(this.currentLoginCompanyId, this.statusId).subscribe(
            res=>{
                console.log(res);
                this.briefStatus = res;
                this.isLoading = false;
            }
        )
    }

    getOpportunitySettingStatus(){
        this.opportunityService.getOpportunitySettingStatus(this.currentLoginCompanyId, this.opportunitySettingStatusId).subscribe(
            res=>{
                this.briefStatus = res;
                this.isLoading = false;
                console.log(res);
            }
        )
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
            this.addCommentForm.value.body[index].img = imgUrl;
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
        const control = <FormArray>this.addCommentForm.controls['body'];
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
        if(this.addCommentForm.controls.body['controls'].length > 1){
            const control = <FormArray>this.addCommentForm.controls['body'];
            control.removeAt(i);
            this.imgsMap.delete(i);
        }
    }

    onSave(){
        if(this.addCommentForm.valid && this.saveOnce){
            this.isLoading = true;
            this.saveOnce = false;
            this.setImgInfoToFormData();
            this.addCommentForm.value.body = JSON.stringify(this.addCommentForm.value.body);
            var request = {
                'oppportunity_status_id' : this.statusId,
                'body': this.addCommentForm.value.body,
                'type':'1'
            }
            if(this.statusId){
                this.opportunityService.addOpportunityComment(this.currentLoginCompanyId, this.statusId,request).subscribe(
                    res=>{
                        this.location.back();
                    }
                )
            }else{
                this.opportunityService.addOpportunitySettingComment(this.currentLoginCompanyId, this.opportunitySettingStatusId, request).subscribe(
                    res=>{
                        this.location.back();
                    }
                )
            }
           

        }
    }

}