import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder,Validators } from "@angular/forms";
import { ContactService } from 'app/core/services/contact.service';
import { ImageService } from 'app/core/services/image.service';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { Location } from '@angular/common';
import { DialogService } from 'app/core/services/dialog.service';

@Component({
    selector:"contact-page",
    templateUrl:"contact-page.component.html",
    styleUrls:['contact-page.component.scss']
})

export class ContactPageComponent implements OnInit{
    contact;
    contactForm: FormGroup;
    currentLoginCompanyId;
    customerId;
    isLoading;
    contactId;
    editContactModal:boolean = false;
    contactUrl;
    mannualInputValue:boolean = false;

    //crop image set
    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private contactService: ContactService,
        private imageService: ImageService,
        private location: Location,
        private dialogService: DialogService
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
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.customerId = this.route.snapshot.paramMap.get('cusid');
        this.contactId = this.route.snapshot.paramMap.get('conid')
    }

    ngOnInit(){
        this.getContactInfo();
    }

    getContactInfo(){
        this.contactService.getCrmContact(this.currentLoginCompanyId, this.contactId).subscribe(
            res=>{
                this.contact = res;
                console.log(this.contact);
                this.createContactForm();
                // console.log(this.contact);
                this.isLoading = false;
            }
        )
      
    }

    createContactForm(){
        this.contactForm = this.fb.group({
            first_name: [this.contact ? this.contact.first_name: '',[Validators.required, Validators.maxLength(20)]],
            last_name:[this.contact ? this.contact.last_name: '',[Validators.required, Validators.maxLength(20)]],
            phone:[this.contact ? this.contact.phone: '',[Validators.required, Validators.maxLength(20)]],
            email: [this.contact ? this.contact.email: '',[Validators.required, Validators.maxLength(20)]],
            position:[this.contact ? this.contact.position: '',[Validators.required, Validators.maxLength(20)]],
            avatar_url:[this.contact ? this.contact.avatar_url: '',[Validators.required, Validators.maxLength(20)]]
        })
    }

    editContact(){
        // console.log('edit this contact');
        this.editContactModal = true;
        this.isLoading = false;
        this.getContactInfo();
    }

    cancelEdit(){
        this.editContactModal = false;
        this.mannualInputValue = false;
    }

    onSave(contact){
        // console.log(contact);
        this.isLoading = true;
        this.editContactModal = false;
        this.mannualInputValue = false;
        this.contactService.updateContact(contact,this.currentLoginCompanyId,this.contactId).subscribe(
            res=>{
                this.contact = res;
                this.isLoading = false;
            }
        )
        this.getContactInfo();
        
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
        // console.log(this.data)
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
        this.mannualInputValue = true;
    }

    testSelected(value){
        console.log(value);
    }

    deleteContact(){
        this.dialogService.openSureDialog().subscribe(
            res=>{
                if(res){
                    console.log('sure');
                    this.contactService.deletePersonalContact(this.currentLoginCompanyId, this.contactId).subscribe(
                        res=>{
                            this.location.back();
                        }
                    )
                }
                
            }
        )
       
    }
}