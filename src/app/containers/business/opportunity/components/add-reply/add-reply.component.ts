import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
    selector: 'add-reply',
    templateUrl: './add-reply.component.html',
    styleUrls:['./add-reply.component.scss']
})

export class AddReplyComponent implements  OnInit{
    currentLoginCompanyId;
    commnetId;
    opportunitySettingCommentId;
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
        if(this.route.snapshot.paramMap.get('commId')){
            this.commnetId = this.route.snapshot.paramMap.get('commId');
        }else{
            this.opportunitySettingCommentId = this.route.snapshot.paramMap.get('opscomId');
            console.log(this.opportunitySettingCommentId);
        }
       
        this.createAddCommentFrom();
        if(this.commnetId){
            this.getBriefComment();
        }else{
            this.getOpportunitySettingComment();
        }
        
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

    getBriefComment(){
        this.opportunityService.getOpporuntiyComnet(this.currentLoginCompanyId, this.commnetId).subscribe(
            res=>{
                console.log(res);
                this.briefStatus = res;
                this.isLoading = false;
            }
        )
    }

    getOpportunitySettingComment(){
        this.opportunityService.getOpportunitySettingComment(this.currentLoginCompanyId, this.opportunitySettingCommentId).subscribe(
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
                'oppportunity_comment_id' : this.commnetId,
                'body': this.addCommentForm.value.body,
                'type':1
            }
            if(this.commnetId){
                this.opportunityService.addOpportunityReply(this.currentLoginCompanyId, this.commnetId, request).subscribe(
                    res=>{
                        this.location.back();
                    }
                )
            }else{
                this.opportunityService.addOpportunitySettingReply(this.currentLoginCompanyId, this.opportunitySettingCommentId, request).subscribe(
                    res=>{
                        console.log(res);
                        this.location.back();
                    }
                )
            }
        }
    }
}