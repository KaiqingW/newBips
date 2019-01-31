import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { ImageService } from 'app/core/services/image.service';
import { InventoryService } from 'app/core/services/inventory.service';
@Component({
    selector:'image-cropper',
    templateUrl:'image-cropper.component.html',
    styleUrls:['image-cropper.component.scss']
})

export class CommonImageCropperComponent implements OnInit{
    @Output() sendImgUrl = new EventEmitter<any>();
    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    imageData;
    currentLoginCompanyId;

    constructor(
        private imageService: ImageService,
        private inventoryService: InventoryService
    ){

       //let width = document.documentElement.clientWidth;

        //setting crop image begin
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        // this.cropperSettings.dynamicSizing = true;
        this.cropperSettings.width = 300;
        this.cropperSettings.height = 300;
        this.cropperSettings.croppedWidth =900;
        this.cropperSettings.croppedHeight = 900;
        this.cropperSettings.canvasWidth = 375;
        this.cropperSettings.canvasHeight = 375;
        this.data = {};
        //setting crop image end
        this.currentLoginCompanyId = localStorage.getItem('currentLoginCompanyId');

    }

    ngOnInit(){

    }

    openCropModal(){
      this.modalOpenCropImage = true;
    }

    onFileChange(event) {
        if(event.target.files.length > 0) {
          let file = event.target.files[0];
          const myReader: FileReader = new FileReader();
            const image = new Image();
            myReader.onloadend = (loadEvent: any) => {
              image.onload = (event) => {
                if (image.height < 3000 && image.width < 3000) {
                  this.cropper.setImage(image);
                } else {
                  alert(`Image too large. close this box and wait for a few seconds.`);
                  this.cropper.setImage(image);
                }
              };
              image.src = loadEvent.target.result;
            };
          myReader.readAsDataURL(file);
          this.modalOpenCropImage = true;
        }
      }

// after crop image, upload the image and replace user's avatar_url
  cropImage() {
    const formData = this.imageService.urltoFormData(this.data.image);
    this.inventoryService.uploadImage(this.currentLoginCompanyId, formData).subscribe(
      res => {
        this.imageData = res;
        this.sendImgUrl.emit(this.imageData);
        this.modalOpenCropImage = false;
        
      },
      err => {
        this.modalOpenCropImage = false;
      }
    );
    // this.imageService.uploadImage(formData).subscribe(
    //     res => {
    //       this.imageUrl = res.url;
    //       this.sendImgUrl.emit(this.imageUrl);
    //       this.modalOpenCropImage = false;
    //     },
    //     err => {
    //       this.modalOpenCropImage = false;
    //     }
    //   );
  }
}