import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { CommonService } from 'app/core/services/common.service';

@Component({
    selector: 'add-attachment',
    templateUrl:'add-attachment.component.html',
    styleUrls: ['add-attachment.component.scss']
})

export class AddAttachmentComponent implements OnInit{
    attachmentForm: FormGroup;
    selectedFile;
    company_id;
    customer_id;
    fd = new FormData();
    modalOpen = false;
    newInfoCallBack;
    product= 0;

    constructor(
        private fb: FormBuilder,
        private dialog : MatDialog,
        private commonService : CommonService,
        @Inject(MAT_DIALOG_DATA) public data:any
    ){
        this.company_id = +this.data.company_id;
        this.customer_id = +this.data.customer_id;
        if(this.data.product){
            this.product = +this.data.product;
        }
        this.createAttachmentForm();
    }

    ngOnInit(){

    }

    createAttachmentForm(){
        this.attachmentForm = this.fb.group({
            name: [''],
            comment:[''],
            attachments:['']
        })
    }

    onFileSelected(event){
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0){
            let file = event.target.files[0];
            this.selectedFile = file;
            this.fd.append('file', file, this.attachmentForm.value.name);
            this.fd.append('description', file.type);
        }
    }

    onSave(){
        if(this.selectedFile){
            if(this.product == 0){
                this.commonService.addAttachment(this.company_id, this.customer_id, this.fd).subscribe(
                    (res)=>{
                    }
                )
            }

            if(this.product == 1){
                this.commonService.addAttachmentForProduct(this.company_id, this.customer_id, this.fd).subscribe(
                    (res)=>{
                    }
                )
            }
        }
    }
    
}