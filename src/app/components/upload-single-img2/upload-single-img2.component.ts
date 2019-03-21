import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/core/services/inventory.service';
import { EventEmitter, Output, Input } from '@angular/core';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-upload-single-img2',
    templateUrl: './upload-single-img2.component.html',
    styleUrls: ['./upload-single-img2.component.scss']
})

export class UploadSingleImg2Component implements OnInit{
    @Input() getImg;
    imgs = [];
    fd = new FormData();
    selectedImgUrl : string = '';
    @Output() imgChange = new EventEmitter<any>();
    company_id: number;
    @Output() sendSave = new EventEmitter<any>();
    constructor(private inventoryService : InventoryService,
                private route: ActivatedRoute){
        this.company_id = +this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit(){
        console.log(this.getImg);
        if(this.getImg != null){
            this.imgs.push(this.getImg);
        }
    }

    onFileChange(event){
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.fd.append('size', file.size);
            this.fd.append('type', file.type);
            this.fd.append('image', file, file.name);
            this.fd.append('description', file.type);
            console.log(this.company_id);
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
        console.log(this.imgs);
        this.imgChange.emit(this.imgs);

    }

    onSave(){
        this.sendSave.emit(this.imgs);
    }
}