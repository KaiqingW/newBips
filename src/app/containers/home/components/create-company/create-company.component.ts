import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'app/core/services/toaster.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyService } from '../../../../core/services/company.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from 'app/core/services/image.service';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
    selector: "create-company",
    templateUrl: "create-company.component.html",
    styleUrls:["create-company.component.scss"]
})

export class CreateCompanyComponent{
    
    isLoading;
    company;
    companyName;
    companyForm: FormGroup;
    currentLoginCompanyId;
    company_url;
    industryCategory = [
        'Service','Agriculture & Food','Apparel,Textiles & Accessories','Auto & Transportation','Bags, Shoes & Accessories','Electronics',
        'Electrical Equipment, Components & Telecoms','Gifts, Sports & Toys','Health & Beauty','Home, Lights & Construction','Machinery, Industrial Parts & Tools',
        'Metallurgy, Chemicals, Rubber & Plastics','Packaging, Advertising & Office'
    ]
    // for angular img cropper
    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    requiredValue:boolean = false;
    LevelOneCategories;
    LevelTwoCategories;
    selectedLevelOneId;
    selectedLevelTwoValue;

    //thirdcategoryCtrl to search category
    thirdCategortCtrl: FormControl = new FormControl();

    //for angular material mat-chip-list and input
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    selectedCategory;
    // separator to separate user input as chips
    separatorKeysCodes = [ENTER, COMMA];

    thirdCategorySearchedList;
    thirdCategoryListChoosed : Array<string> = [];
    categoryStoreList:any = [];

    constructor(
        private fb: FormBuilder,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private location: Location,
        private router: Router,
        private imageService: ImageService
    ){
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = 500;
        this.cropperSettings.height = 500;
        this.cropperSettings.dynamicSizing = true;
        this.data = {};
        
        this.isLoading = true;
        this.companyName= this.route.snapshot.paramMap.get('companyName');
        this.createForm();
        this.getLevelOneCompanyCategories();

        this.thirdCategortCtrl = new FormControl();
        this.thirdCategortCtrl.valueChanges.subscribe(
          (term)=>{
            this.onSearchThirdCategory(term);
          }
        );
    }

    ngOnInit(){
        this.isLoading = false;
        setTimeout(() => {
            this.isLoading = false;
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                if(!this.companyForm.valid){
                    this.requiredValue = true;
                }
                if(this.companyForm.valid){
                    this.requiredValue = false;
                    this.onSave();
                }
            });
        }, 0);
    }

    getLevelOneCompanyCategories(){
        this.companyService.getCompanyCategories('0').subscribe(
            res=>{
                this.LevelOneCategories = res;
                // console.log(res);
            }
        )
    }

    getLevelTwoCompanyCategories(value){
        this.companyService.getCompanyCategories(value).subscribe(
            res=>{
                this.LevelTwoCategories = res;
            }
        )
    }

    selectedLevelOneCategory(value){
        this.selectedLevelOneId = value.id;
        // console.log(this.selectedLevelOneId);
        this.getLevelTwoCompanyCategories(this.selectedLevelOneId);
    }

    getSubCategoryValue(value){
        // console.log(value);
        this.selectedLevelTwoValue = value;
    }

  
    createForm(){
        this.companyForm = this.fb.group({
            name: [ this.companyName ? this.companyName: ''],
            industry:[this.company ? this.company.industry: ''],
            logo_url:[this.company ? this.company.logo_url: ''],
            website: [this.company ? this.company.website: ''],
            type:[this.company ? this.company.type: ''],
            // phone:[this.company ? this.company.phone: '', [Validators.required, Validators.maxLength(20)]],
            // email:[this.company ? this.company.email: '', [Validators.required, Validators.maxLength(20)]],
            // address:this.fb.group({
            //     country:[''],
            //     state: [''],
            //     city:[''],
            //     street1:[''],
            //     street2:[''],
            //     zipcode:['']
            // })
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
              this.company_url = res.url;
              this.isLoading = false;
              this.modalOpenCropImage = false;
            },
            err => {
              this.isLoading = false;
              this.modalOpenCropImage = false;
            }
          );
      }

    getCompanynameErrorMessage(){
        return this.companyForm.controls.name.hasError('required') ? 'You must enter a value' :
        this.companyForm.controls.name.hasError('maxlength') ? 'Should be at most 20 characters':
        '';
    } 

    contactCategoryValue(value){
        // console.log(value + '@@' + this.selectedLevelTwoValue);
        return value + '=>' + this.selectedLevelTwoValue;
    }

    onSave(){
        this.isLoading = true;
        this.companyForm.value.name = this.companyName;
        this.companyForm.value.logo_url = this.company_url;
        if(this.companyForm.value.industry){
            this.categoryStoreList.splice(0, 1,this.companyForm.value.industry);
            // console.log(this.categoryStoreList);
        }
        if(this.selectedLevelTwoValue){
            this.categoryStoreList.splice(1, 2,this.selectedLevelTwoValue);
            // console.log(this.categoryStoreList);
        }
        if(this.thirdCategoryListChoosed){
            this.companyForm.value.industry = JSON.stringify(this.categoryStoreList.concat(this.thirdCategoryListChoosed));
            // console.log(this.categoryStoreList);
        }

        this.companyService.addCompany(this.companyForm.value).subscribe(res =>{
            this.router.navigateByUrl(`/home`).then(() =>{
                this.isLoading = false;
                this.toasterService.showToaster('Created Successful!', '', 3000)
            })
        })
    }


    // remove category from thirdcategorylist
    remove(category: any): void {
        const index = this.thirdCategoryListChoosed.indexOf(category);
        if (index >= 0) {
        this.thirdCategoryListChoosed.splice(index, 1);
        }
        console.log(this.thirdCategoryListChoosed);
    }

  
  // for adding new chips after input token ends
  add(event: MatChipInputEvent): void {
        setTimeout(e => {
            const input = event.input;
            const value = this.selectedCategory || event.value;
            // Add our email
            this.addHelper(value);
            // Reset the input value
            if (input) {
            input.value = '';
            }
            this.selectedCategory = '';
        }, 0);
    }

     // if value is valid email and not included in the emailList, then add it to email list
     addHelper(value: string): void {
       console.log(value);
      if ((value || '').trim()) {
        value = value.trim().toLowerCase();
        console.log(value);
        console.log(this.thirdCategoryListChoosed);
        if (!this.thirdCategoryListChoosed.includes(value)) {
          this.thirdCategoryListChoosed.push(value);
          console.log(this.thirdCategoryListChoosed);
        }
      }
    }

    onSearchThirdCategory(term){
      this.companyService.searchCompanyCategories(22, term).subscribe(
        res=>{
          this.thirdCategorySearchedList = res;
          console.log(res);
        }
      )
    }

    selectOption(event) {
      console.log(event);
      this.selectedCategory = event.option.value;
    }

}