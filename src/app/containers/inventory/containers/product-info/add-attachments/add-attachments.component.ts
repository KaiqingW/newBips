import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { InventoryService } from 'app/core/services/inventory.service';

@Component({
    selector:'add-attachments',
    templateUrl: './add-attachments.component.html',
    styleUrls:['./add-attachments.component.scss']
})

export class AddAttachmentComponent implements OnInit{
    attachmentForm: FormGroup;
    newAttchmentCallBack;
    selectedFile;
    company_id: number;
    product_id: number;
    fd = new FormData();
    modalOpen = false;
    selectFolderName = '';
    isLoading : boolean = false;
    choose = 'folder';

    constructor(private dialog: MatDialog,
                private fb: FormBuilder,
                private inventoryService: InventoryService,
                @Inject(MAT_DIALOG_DATA) public data: any){
        this.company_id = + this.data.company_id;
        this.product_id = + this.data.product_id;
        this.selectFolderName = this.data.selectFolderName;     
        if(this.selectFolderName){
            this.choose = 'file';
        }   
        this.createAttachmentForm();
    }

    ngOnInit(){}

    createAttachmentForm(){
        this.attachmentForm = this.fb.group({
            choose: [this.choose],
            name : [''],
            attachments:[''],
            folder:[''],
            comment: ['']
        });
    }

    onFileSelected(event){
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.selectedFile = file;
            this.fd.append('file', file, this.attachmentForm.value.name);
            this.fd.append('category', this.attachmentForm.value.folder);
            this.fd.append('comment', this.attachmentForm.value.comment);
            // i dont konw why the type doesn't change, so i use description for file type;
            this.fd.append('description', file.type);
        }
    }
   
    onSave(){
        this.isLoading = true;
        if(this.selectedFile){
            this.inventoryService.addAttachment(this.company_id, this.product_id, this.fd).subscribe(
                (res) => {
                    this.isLoading = false;
                   this.newAttchmentCallBack = res;
                }
            )
        } else {
            let content = "http://192.168.50.127:4200/assets/images/icons/folder.png";
            let data = new Blob([content],{ type: 'text/plain' });
            let arrayOfBlob = new Array<Blob>();
            arrayOfBlob.push(data);
            var file = new File(arrayOfBlob, "upload_level_up.png", {type: "text/plain"});
            this.fd.append('file', file, 'upload_level_up.png');
            this.fd.append('category', this.attachmentForm.value.folder);
            this.fd.append('description', 'text/plain');
            this.inventoryService.addAttachment(this.company_id, this.product_id, this.fd).subscribe(
                (res) => {
                    this.isLoading = false;
                   this.newAttchmentCallBack = res;
                }
            )
        }
       
    }
}