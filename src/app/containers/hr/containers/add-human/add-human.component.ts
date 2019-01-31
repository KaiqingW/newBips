import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule, FormGroupDirective} from "@angular/forms";
import { ToasterService } from 'app/core/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ImageService } from 'app/core/services/image.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

@Component({
    selector:'add-human',
    templateUrl:'add-human.component.html',
    styleUrls:['add-human.component.scss']
})

export class AddHumanComponent implements OnInit{

    currentLoginCompanyId;
    humanForm:FormGroup;
    isLoading;
    human_avatar_url;
/*******************cropper image bengin **********************************/
    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
/*******************cropper image ending************************************/

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private toasterService: ToasterService,
        private imageService: ImageService,
    ){
/***************************set cropper data****************************/
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = 350;
        this.cropperSettings.height = 350;
        this.cropperSettings.dynamicSizing = true;
        this.data = {};
/*************************************************************************/
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.createHumanForm();
    }
    ngOnInit(){

    }

    createHumanForm(){
        this.humanForm = this.fb.group({
        avatar_url:[''],
        first_name:[''],
        last_name:[''],
        gender:[''],
        date_of_birth:[''],
        date_joined:[''],
        date_left:[''],
        details:[''],
        address: this.fb.group({
            street1: '',
            street2: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
            })
        })

    }

/********************************image cropper function begin******************************* */
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
    this.isLoading = true;
    const formData = this.imageService.urltoFormData(this.data.image);
    this.imageService.uploadImage(formData).subscribe(
        res => {
          this.human_avatar_url = res.url;
          this.isLoading = false;
          this.modalOpenCropImage = false;
        },
        err => {
          this.isLoading = false;
          this.modalOpenCropImage = false;
        }
      );
  }

/********************************image cropper function end******************************* */
}
