import { Component, OnInit, Inject, Output, EventEmitter,Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { CommonService } from 'app/core/services/common.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { ActivatedRoute } from '@angular/router';

import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
    selector: 'add-attachment',
    templateUrl:'add-attachment.component.html',
    styleUrls: ['add-attachment.component.scss']
})

export class AddAttachmentComponent implements OnInit{
    @Output() sendFile = new EventEmitter<any>();
    attachmentForm: FormGroup;
    selectedFile;
    company_id;
    customer_id;
    fd = new FormData();
    modalOpen = false;
    newInfoCallBack;
    product= 0;
    newAttchmentCallBack;
    product_id: number;
    selectFolderName = '';
    isLoading : boolean = false;
    choose = 'folder';
    params;

    processedFile;

    processFileFlag: boolean = true;

    constructor(
        private fb: FormBuilder,
        private dialog : MatDialog,
        private commonService : CommonService,
        private inventoryService: InventoryService,
        private route: ActivatedRoute,
        public dialogRef: MatDialogRef<AddAttachmentComponent>,
        @Inject(MAT_DIALOG_DATA) public data:any,
        private ng2ImgMax: Ng2ImgMaxService
    ){

        if(this.data.params){
            this.params = this.data.params;
            this.company_id = +this.params.company_id;
            this.product_id = +this.params.product_id;
        }        
        if(this.data.product){
            this.product = +this.data.product;
        }
        this.selectFolderName = this.data.selectFolderName;     
        if(this.selectFolderName){
            this.choose = 'file';
        }  
        this.createAttachmentForm();
    }

    ngOnInit(){

    }
    
    closeDialog() {
        this.dialogRef.close(this.fd);
    }

    createAttachmentForm(){
        this.attachmentForm = this.fb.group({
            choose: [''],
            name : [''],
            attachments:[''],
            folder:[''],
            comment: ['']
        })
    }

    onFileSelected(event){
        this.isLoading = true;
        this.processFileFlag = false;
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0){
            let file = event.target.files[0];

            let fileType = file.type;

            let fileTypeArr = fileType.split('/');

            // check the type of uploaded file
            // if the upload file is image, resize the image
            // else, directly upload the file to backend, editted by yali
            if (fileTypeArr[0] == "image") {
                // resize the image, set width to 600, and height resized accordingly to keep the aspect ratio the same. editted by yali
                this.ng2ImgMax.resizeImage(file, 600, 10000).subscribe(
                    (res) => {
                        this.processedFile = new File([res], res.name);

                        this.fd.append('file', this.processedFile);
                        this.processFileFlag = true;
                        this.isLoading = false;
                    },
                    (err) => {
                        console.log('😢 Oh no!', err);
                    }
                );
            } else {
                this.fd.append('file', file);
                this.processFileFlag = true;
                this.isLoading = false;            
            }
              

            this.selectedFile = file;
            this.fd.append('name', this.attachmentForm.value.name);
            this.fd.append('category', this.attachmentForm.value.folder);
            this.fd.append('comment', this.attachmentForm.value.comment);
            this.fd.append('description', file.type);
        }

    }

    onSave(){
        this.isLoading = true;
        if(this.selectedFile){
            // this.inventoryService.addAttachment(this.company_id, this.product_id, this.fd).subscribe(
            //     (res) => {
            //         this.isLoading = false;
            //        this.newAttchmentCallBack = res;
            //     }
            // )
            this.closeDialog();
        } 
        else {
            let content = "http://192.168.50.127:4200/assets/images/icons/folder.png";
            let data = new Blob([content],{ type: 'text/plain' });
            let arrayOfBlob = new Array<Blob>();
            arrayOfBlob.push(data);
            var file = new File(arrayOfBlob, "upload_level_up.png", {type: "text/plain"});
            this.fd.append('file', file, 'upload_level_up.png');
            this.fd.append('category', this.attachmentForm.value.folder);
            this.fd.append('description', 'text/plain');
            // this.inventoryService.addAttachment(this.company_id, this.product_id, this.fd).subscribe(
            //     (res) => {
            //         this.isLoading = false;
            //        this.newAttchmentCallBack = res;
            //     }
            // )
            this.closeDialog();
        }

    }
}