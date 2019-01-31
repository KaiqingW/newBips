import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
// import { FileValidator } from 'app/containers/purchase-order/file-input.validator';
import { OrdersService } from 'app/core/services/orders.service';
@Component({
    selector:'add-attachements',
    templateUrl: './add-attachements.component.html',
    styleUrls:['./add-attachements.component.scss']
})

export class AddAttachmentComponent implements OnInit{
    attachmentForm: FormGroup;
    newAttchmentCallBack;
    selectedFile;
    company_id: number;
    order_item_id: number;
    fd = new FormData();
    modalOpen = false;
    selectFolderName = '';
    isLoading : boolean = false;
    choose = 'folder';
    edit_mode;
    selectFolderStatus;
    must_public;

    constructor(private dialog: MatDialog,
                private fb: FormBuilder,
                private ordersService: OrdersService,
                public dialogRef: MatDialogRef<AddAttachmentComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any){
        this.company_id = + this.data.company_id;
        this.order_item_id = + this.data.order_item_id;
        this.selectFolderName = this.data.selectFolderName;  
        this.selectFolderStatus = this.data.selectFolderStatus;
        this.edit_mode = this.data.edit_mode;
        this.must_public = this.data.edit_mode;
        if(this.selectFolderName){
            this.choose = 'file';
            this.edit_mode = this.selectFolderStatus;
        }      
        console.log(this.selectFolderStatus);
        this.createAttachmentForm();
    }

    ngOnInit(){}

    createAttachmentForm(){
        this.attachmentForm = this.fb.group({
            choose: [this.choose],
            name : [''],
            attachments:[''],
            folder:[''],
            comment: [''],
            public : [this.edit_mode]
        });
    }

    onFileSelected(event){
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            // console.log(event.target.files, event.target.files.length);
            let file = event.target.files[0];
            this.selectedFile = file;
            this.fd.append('file', file);
            this.fd.append('name', this.attachmentForm.value.name);
            this.fd.append('category', this.attachmentForm.value.folder);
            this.fd.append('comment', this.attachmentForm.value.comment);
            // i dont konw why the type doesn't change, so i use description for file type;
            // this.fd.append('type', file.type);
            this.fd.append('description', file.type);
            this.fd.append('public', this.attachmentForm.value.public);
            console.log(this.fd);
        }
    }
   
    onSave(){
        this.isLoading = true;
        if(this.selectedFile){
         
            this.ordersService.addAttachment(this.company_id, this.order_item_id, this.fd).subscribe(
                (res) => {
                    this.isLoading = false;
                    this.dialogRef.close(this.newAttchmentCallBack);
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
            this.fd.append('public', this.attachmentForm.value.public);
            this.fd.append('description', 'text/plain');
                this.ordersService.addAttachment(this.company_id, this.order_item_id, this.fd).subscribe(
                    (res) => {
                        this.isLoading = false;
                        this.dialogRef.close(this.newAttchmentCallBack);
                       this.newAttchmentCallBack = res;
                    }
                )
        }
    }
}