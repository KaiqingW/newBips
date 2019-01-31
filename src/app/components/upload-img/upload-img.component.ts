import { Component, OnInit, OnChanges } from '@angular/core';
import { InventoryService } from 'app/core/services/inventory.service';
import { EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'app-upload-img',
    templateUrl: './upload-img.component.html',
    styleUrls: ['./upload-img.component.scss']
})

export class UploadImgComponent implements OnInit, OnChanges {
    imgs = [];
    fd = new FormData();
    selectedImgUrl: string = '';
    @Output() imgChange = new EventEmitter();
    @Input() company_id: number;
    @Input() initalImgs = [];
    constructor(private inventoryService: InventoryService) {

    }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.initalImgs && this.initalImgs.length > 0) {
            this.fetchInitialImgs();
            this.imgChanged();
        }
    }

    fetchInitialImgs() {
        this.imgs = this.imgs.concat(this.initalImgs);
    }

    onFileChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.fd.append('size', file.size);
            this.fd.append('type', file.type);
            this.fd.append('image', file, file.name);
            this.fd.append('description', file.type);
            this.inventoryService.uploadImage(this.company_id, this.fd).subscribe(
                (res) => {
                    this.imgs.push(res);
                    console.log(res);
                    this.imgChanged();
                }
            )
        }
    }


    onReceiveImgUrl(event) {
        console.log(event);
        this.imgs.push(event);
        this.imgChanged();
    }

    removeImg(i) {
        this.imgs.splice(i, 1);
        this.imgChanged();
    }

    onSelectedImg(i) {
        this.selectedImgUrl = this.imgs[i].url;
    }

    closeModal() {
        this.selectedImgUrl = '';
    }

    imgChanged() {
        this.imgChange.emit(this.imgs);
    }

}