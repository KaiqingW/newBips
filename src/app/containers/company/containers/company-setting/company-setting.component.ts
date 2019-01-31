import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'app/core/services/toaster.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyService } from '../../../../core/services/company.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from 'app/core/services/image.service';
import { DialogService } from 'app/core/services/dialog.service';

import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

@Component({
    selector: "company-setting",
    templateUrl: "company-setting.component.html",
    styleUrls:["company-setting.component.scss"]
})

export class CompanySettingComponent{
    
    isLoading;
    company;
    companySettingForm: FormGroup;
    currentLoginCompanyId;
    company_new_logo_url;
    company_old_logo_url;
    fillINAddress:boolean = false;
    companyAddressId;
    //for copper img
    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    constructor(
        private fb: FormBuilder,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private location: Location,
        private router: Router,
        private imageService: ImageService,
        private dialogService: DialogService
    ){
        //setting for copper
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = 350;
        this.cropperSettings.height = 350;
        this.cropperSettings.dynamicSizing = true;
        this.data = {};

        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.createForm();
    }

    ngOnInit(){
        this.companyService.getCompany(this.currentLoginCompanyId).subscribe(res=>{
            this.company = res;
            if(res.address){
                this.companyAddressId = res.address.id;
                console.log(this.companyAddressId);
            }
            console.log(this.company);
            this.company_old_logo_url = res.logo_url;
            this.isLoading = false;
        });
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                if (this.companySettingForm.invalid) {
                    this.onSave();
                }
            });
        }, 0);
    }

    createForm(){
        this.companySettingForm = this.fb.group({
            name: [this.company ? this.company.name: '',[Validators.required, Validators.maxLength(20)]],
            industry:[this.company ? this.company.industry: '',[Validators.required, Validators.maxLength(20)]],
            logo_url:[this.company ? this.company.logo_url: '',[Validators.required, Validators.maxLength(20)]],
            website: [this.company ? this.company.website: '', [Validators.required, Validators.maxLength(20)]],
            phone: [this.company ? this.company.phone: '', [Validators.required, Validators.maxLength(20)]],
            email: [this.company ? this.company.email: '', [Validators.required, Validators.maxLength(20)]],
            fax: [this.company ? this.company.fax: '', [Validators.required, Validators.maxLength(20)]],
            database_name:[this.company ? this.company.database_name: '', [Validators.required, Validators.maxLength(20)]],
            description:[this.company ? this.company.description:'',],
            address: this.fb.group({
                id : '',
                street1: '',
                type:'office',
                street2: '',
                city: '',
                state: '',
                zipcode: '',
                country: '',
            })
        })
    }

    getCompanynameErrorMessage(){
        return this.companySettingForm.controls.name.hasError('required') ? 'You must enter a value' :
        this.companySettingForm.controls.name.hasError('maxlength') ? 'Should be at most 20 characters':
        '';
    } 

    onSave(){
        
        if(this.company_new_logo_url){
            this.companySettingForm.value.logo_url = this.company_new_logo_url;
        }else{
            this.companySettingForm.value.logo_url = this.company_old_logo_url;
        }
        if(this.companyAddressId){
            this.companySettingForm.value.address.id = this.companyAddressId;
        }
        this.dialogService.openSureDialog().subscribe(result =>{
            this.isLoading = true;
            this.companyService.editCompany(this.currentLoginCompanyId,this.companySettingForm.value)
            .subscribe((res)=>{
                this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/dashboard`);
                this.isLoading = false;
            },
            error=>{
                this.fillINAddress = true;
                this.isLoading = false;
            })
            
        })

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
        this.isLoading = true;
        const formData = this.imageService.urltoFormData(this.data.image);
        this.imageService.uploadImage(formData).subscribe(
            res => {
            this.company_new_logo_url = res.url;
            this.isLoading = false;
            this.modalOpenCropImage = false;
            },
            err => {
            this.isLoading = false;
            this.modalOpenCropImage = false;
            }
        );
    }

}