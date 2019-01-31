import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/core/services/inventory.service';
import { EventEmitter, Output, Input } from '@angular/core';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER } from '@angular/cdk/collections';

@Component({
    selector: 'app-upload-single-img',
    templateUrl: './upload-single-img.component.html',
    styleUrls: ['./upload-single-img.component.scss']
})

export class UploadSingleImgComponent implements OnInit{
    imgs = [];
    fd = new FormData();
    selectedImgUrl : string = '';
    @Output() imgChange = new EventEmitter<any>();
    @Input() company_id: number;
    @Output() sendSave = new EventEmitter<any>();
    constructor(private inventoryService : InventoryService){

    }

    ngOnInit(){

    }

    onFileChange(event){
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.fd.append('size', file.size);
            this.fd.append('type', file.type);
            this.fd.append('image', file, file.name);
            this.fd.append('description', file.type);
            
            this.inventoryService.uploadImage(this.company_id,this.fd).subscribe(
                (res) => {
                     this.imgs.push(res);
                     this.imgChanged();
                }
            )
        }
    }

    removeImg(i){
        this.imgs.splice(i, 1);
        this.imgChanged();
    }

    onSelectedImg(i){
        this.selectedImgUrl = this.imgs[i].url;
    }

    closeModal(){
        this.selectedImgUrl = '';
    }

    imgChanged() {
        this.imgChange.emit(this.imgs);

    }

    onSave(){
        this.sendSave.emit(this.imgs);
    }
}