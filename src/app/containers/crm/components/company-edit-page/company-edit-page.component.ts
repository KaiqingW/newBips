import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { ImageService } from 'app/core/services/image.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Lead, LeadService } from '../../../../core/services/lead.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Location } from '@angular/common';
import { CompanyService } from 'app/core/services/company.service';

@Component({
    selector:"company-edit-page",
    templateUrl:"company-edit-page.component.html",
    styleUrls:["company-edit-page.component.scss"]
})

export class CompanyEditPageComponent implements OnInit{
    customer;
    customerForm :FormGroup;
    currentLoginCompanyId;
    leadId;
    isLoading;
    levelOneCategoryValue;
    levelOneCategoryFValue;
    levelTwoCategoryValue;
    levelTwoCategoryFValue;
    levelThreeCategoryValue;

    levelOneCategoryList;
    levelTwoCategoryList;
    LevelTwoCategoryList;
    LevelThreeCategoryList;
    categoryStoreList:any = [];
    thirdCategoryListChoosed : Array<string>;
     // for angular img cropper
    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: LeadService,
        private fb: FormBuilder,
        private imageService: ImageService,
        private toasterService: ToasterService,
        private location: Location,
        private companyService: CompanyService

    ){
        this. createCustomerForm();
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.leadId = this.route.snapshot.paramMap.get('cusid');
        if(!this.leadId){
          this.leadId = this.route.snapshot.paramMap.get('ven_id');
        }
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = 350;
        this.cropperSettings.height = 350;
        this.cropperSettings.dynamicSizing = true;
        this.data = {};

        this.thirdCategortCtrl = new FormControl();
        this.thirdCategortCtrl.valueChanges.subscribe(
          (term)=>{
            this.onSearchThirdCategory(term);
          }
        )
    }
    

    ngOnInit(){
    // listen to the save button in the header tool bar
    setTimeout(() => {
      const buttonClick = document.getElementById('header-submit-edit');
      buttonClick.addEventListener('click', () => {
        // if (this.profileForm.valid) {
          this.onSave();
        // }
      });
    }, 0);
    this.service.getLead(this.currentLoginCompanyId, this.leadId).subscribe(
        res=> {
            this.customer = res;
            this.levelOneCategoryValue = this.getLevelOneCategory(res.industry);
            // console.log(this.levelOneCategoryValue);
            this.levelTwoCategoryValue = this.getLevelTwoCategory(res.industry);
            // console.log(this.levelTwoCategoryValue);
            this.thirdCategoryListChoosed = this.getLevelThreeCategory(res.industry);

            this.createCustomerForm();
            this.isLoading = false;
        });
        // this.createCustomerForm();
      this.getLevelOneCategoryList();
    }

    createCustomerForm(){
        this.customerForm = this.fb.group({
            // logo_url:[this.customer ? this.customer.logo_url : '', [Validators.required, Validators.maxLength(20)] ],
            name:[this.customer ? this.customer.name: '', [Validators.required, Validators.maxLength(20)]],
            type:[''],
            industry:[],
            website:[this.customer ? this.customer.website:'' , [Validators.required, Validators.maxLength(20)]],
            telephone_number:[this.customer ? this.customer.telephone_number:'' , [Validators.required, Validators.maxLength(20)]],
            fax_number:[this.customer ? this.customer.fax_number : '', [Validators.required, Validators.maxLength(20)]],
            email:[this.customer ? this.customer.email : '', [Validators.required, Validators.maxLength(20)]],
            lead_possibility:[this.customer ? this.customer.lead_possibility : '', [Validators.required, Validators.maxLength(20)]],
            lead_status:[this.customer ? this.customer.lead_status: '', [Validators.required, Validators.maxLength(20)]],
            lead_source:[this.customer ? this.customer.lead_source: '', [Validators.required, Validators.maxLength(20)]],
            description:[this.customer ? this.customer.description: '', [Validators.required, Validators.maxLength(20)]],
            memo:[this.customer ? this.customer.memo: '',[Validators.required, Validators.maxLength(20)] ],
            order_capacity:['']
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
          this.customer.logo_url = res.url;
          this.isLoading = false;
          this.modalOpenCropImage = false;
        },
        err => {
          this.isLoading = false;
          this.modalOpenCropImage = false;
        }
      );
  }

  onSave(){
    this.isLoading = true;
    const updateCustomer = this.customerForm.value;
    updateCustomer.logo_url = this.customer.logo_url;
    if(this.levelOneCategoryValue){
      this.categoryStoreList.splice(0, 1, this.levelOneCategoryValue);
      if(this.levelTwoCategoryValue){
        this.categoryStoreList.splice(1, 2, this.levelTwoCategoryValue);
      }
    }
    updateCustomer.industry = JSON.stringify(this.categoryStoreList.concat(this.thirdCategoryListChoosed));
    this.service.editLead(this.currentLoginCompanyId, this.leadId, updateCustomer).subscribe(
      res=>{
          this.location.back();
          this.toasterService.showToaster('Customer Updated');
      });
  }

  getLevelOneCategory(value){
    if(!value){return;}
    if(value&&!value.includes('=>')&&!value.includes('["')){return value;}
    if(value.includes('=>')){
      if(value){
            let target = value;
            let num = target.indexOf('=>');
            if(num >0){
              return  target.substring(0, num);
            }else{
              return;
            }
          }else{
            return;
          }
    }
    
    if(typeof(JSON.parse(value))=='object'){
          if(JSON.parse(value).length>=1){
            return JSON.parse(value)[0];
        }else{
            return  '';
        }
    }

    
  }

  getLevelTwoCategory(value){
    if(!value){return;}
    if(value&&!value.includes('=>')&&!value.includes('["')){return value;}
    if(value.includes('=>')){
        if(value){
        let target = value;
        let num = target.indexOf('=>');
        if(num > 0){
          return  target.substring(num + 2);
        }else{
          return;
        }
      }
    }

    if(typeof(JSON.parse(value))=='object'){
      if(JSON.parse(value).length>=2){
        return JSON.parse(value)[1];
      }else{
          return  '';
      }
    }
   
  }

  getLevelThreeCategory(value){
    if(!value){return [];}
    if(value&&!value.includes('=>')&&!value.includes('["')){return [];}

    if(value.includes('=>')){ return [];}

    if(typeof(JSON.parse(value))=='object'){

      if(JSON.parse(value).length>=2){
            return JSON.parse(value).splice(2);
          }else{
              return  [];
          }
    }
    
  }

  getLevelOneCategoryList(){
    this.companyService.getCompanyCategories('0').subscribe(
      res=>{
        this.levelOneCategoryList = res;
      }
    )
  }

  getLevelTwoCompanyCategories(id, value){
    this.levelOneCategoryFValue = value;
    this.companyService.getCompanyCategories(id).subscribe(
        res=>{
            this.LevelTwoCategoryList = res;
        }
    )
}

  getLevelTwoCategoryValue(value){
    // console.log(value);
    // this.levelTwoCategoryValue = value;
    this.levelTwoCategoryFValue = value;
  }


  // remove category from thirdcategorylist
  remove(category: any): void {
    const index = this.thirdCategoryListChoosed.indexOf(category);
    if (index >= 0) {
      this.thirdCategoryListChoosed.splice(index, 1);
    }
    // console.log(this.thirdCategoryListChoosed);
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
      //  console.log(value);
      if ((value || '').trim()) {
        value = value.trim().toLowerCase();
        // console.log(value);
        // console.log(this.thirdCategoryListChoosed);
        if (!this.thirdCategoryListChoosed.includes(value)) {
          this.thirdCategoryListChoosed.push(value);
          // console.log(this.thirdCategoryListChoosed);
        }
      }
    }

    onSearchThirdCategory(term){
      this.companyService.searchCompanyCategories(22, term).subscribe(
        res=>{
          this.thirdCategorySearchedList = res;
          // console.log(res);
        }
      )
    }

    selectOption(event) {
      // console.log(event);
      this.selectedCategory = event.option.value;
    }
  

}