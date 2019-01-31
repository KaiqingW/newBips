import { Component, OnInit, ViewChild} from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { ToasterService } from 'app/core/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from 'app/core/services/lead.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ImageService } from 'app/core/services/image.service';
import { ContactService } from 'app/core/services/contact.service';
import { Location } from '@angular/common';
import { NotesService } from 'app/core/services/notes.service';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

@Component({
    selector: 'add-contact',
    templateUrl:'add-contact.component.html',
    styleUrls: ['add-contact.component.scss']
})

export class AddContactComponent implements OnInit{
    emailCtrl : FormControl;
    userEmailList ;
    contactForm: FormGroup;
    currentLoginCompanyId;
    customer_id;
    isLoading;
    selectedUser;
    imputUser;
    contactUrl;
    positionOthers:boolean = false;
    default_avatar_url='https://orcasmart-dev.s3.us-east-2.amazonaws.com/images/DEM6o0kwR6IqaVRU1a1sPpYTdpT9sfy5AfLpMjhQ.png';

    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private toasterService: ToasterService,
        private leadService: LeadService,
        private imageService: ImageService,
        private contactService: ContactService,
        private location: Location,
        private notesService: NotesService
    ){
        //setting crop image begin
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = 350;
        this.cropperSettings.height = 350;
        this.cropperSettings.dynamicSizing = true;
        this.data = {};
        //setting crop image end

        this.createContactForm();
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customer_id = this.route.snapshot.paramMap.get('cusid');
        if(!this.customer_id){
            this.customer_id = this.route.snapshot.paramMap.get('ven_id');
        }

        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=> {
                this.onSearch(term);
                // console.log(term);
            }
        )
    }

    ngOnInit(){
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                this.onSave();
            });
          }, 0);

        //   console.log(123);
    }

    onSearch(value){
        this.imputUser = value;
        // console.log(value);
        this.notesService.getUserEmailList(value).subscribe(
             res=>{
                 this.userEmailList = res;
                 console.log(this.userEmailList);
             }
         ) 
    }
    userSlected(value){
        this.selectedUser = value;
  
    }

    createContactForm(){
        this.contactForm = this.fb.group({
            first_name: [''],
            user_id :[''],
            type:['0'],
            last_name:[''],
            phone:[''],
            email: [''],
            position:[''],
            avatar_url:['https://orcasmart-dev.s3.us-east-2.amazonaws.com/images/DEM6o0kwR6IqaVRU1a1sPpYTdpT9sfy5AfLpMjhQ.png']
        })
    }

    onSave(){
        this.isLoading = true;
        if(this.selectedUser){
            if(this.selectedUser.avatar_url){
                console.log(1);
                this.contactForm.value.avatar_url = this.selectedUser.avatar_url;
            }else if(this.contactUrl){
                console.log(2);
                this.contactForm.value.avatar_url = this.contactUrl;
            }else{
                console.log(3);
                this.contactForm.value.avatar_url = this.default_avatar_url;
            }
            
        }else{
            this.contactForm.value.email = this.imputUser;
        }
       
        this.contactService.addCrmContact(this.contactForm.value, this.currentLoginCompanyId, this.customer_id).subscribe(
            res=>{
                this.location.back();
                this.toasterService.showToaster('Created Successfully!', '', 3000);
            }
        )
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
        console.log(this.data)
      }

      // after crop image, upload the image and replace user's avatar_url
    cropImage() {
        this.isLoading = true;
        const formData = this.imageService.urltoFormData(this.data.image);
        this.imageService.uploadImage(formData).subscribe(
            res => {
            this.contactUrl = res.url;
            this.isLoading = false;
            this.modalOpenCropImage = false;
            },
            err => {
            this.isLoading = false;
            this.modalOpenCropImage = false;
            }
        );
    }

    mannualInput(){
        this.positionOthers = true;
    }

}