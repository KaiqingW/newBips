import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { ToasterService } from 'app/core/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from 'app/core/services/lead.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ImageService } from 'app/core/services/image.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatChipInputEvent } from '@angular/material';

import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { StreetTypesService } from 'app/core/data/street.service';
import { ZipCodeService } from 'app/core/services/zipcode.service';
import { SearchService } from 'app/core/services/search.service';
import { CompanyService } from 'app/core/services/company.service';

@Component({
    selector:'add-vendor',
    templateUrl:'add-vendor.component.html',
    styleUrls:['add-vendor.component.scss']
})

export class AddVendorComponent implements OnInit{
    companyNameCtrl : FormControl;
    finalInput;
    companyNameList;
    selectedCompany;
    vendorForm: FormGroup;
    addContacts: boolean = false;
    addAddresses: boolean = false;
    currentLoginCompanyId;
    isLoading;
    company_url;
    industryCategory = [
        'Service','Agriculture & Food','Apparel,Textiles & Accessories','Auto & Transportation','Bags, Shoes & Accessories','Electronics',
        'Electrical Equipment, Components & Telecoms','Gifts, Sports & Toys','Health & Beauty','Home, Lights & Construction','Machinery, Industrial Parts & Tools',
        'Metallurgy, Chemicals, Rubber & Plastics','Packaging, Advertising & Office'
    ]

    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    //error message
    customerAlreadyExist:boolean = false;
    customerNameRequired:boolean = false;
    customerTypeRequired:boolean = false;

    // industry type 
    LevelOneCategories;
    selectedLevelOneId;
    LevelTwoCategories;
    selectedLevelTwoValue;
    selectedLevelOneValue;
    selectedLevelThreeValue;
    LevelThreeCategories;
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
    thirdCategoryListChoosed : Array<string> =[];
    categoryStoreList:any = [];
    thirdCategorySearchedList;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private toasterService: ToasterService,
        private leadService: LeadService,
        private imageService: ImageService,
        private streetTypesService: StreetTypesService,
        private zipCodeService : ZipCodeService,
        private searchService : SearchService,
        private companyService: CompanyService

    ){
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        // this.cropperSettings.width = 350;
        // this.cropperSettings.height = 350;
        this.cropperSettings.width = 300;
        this.cropperSettings.height = 300;
        this.cropperSettings.croppedWidth =900;
        this.cropperSettings.croppedHeight = 900;
        this.cropperSettings.canvasWidth = 375;
        this.cropperSettings.canvasHeight = 375;
        // this.cropperSettings.dynamicSizing = true;
        this.data = {};
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this. createCustomerForm();
        this.isLoading = true;

        this.companyNameCtrl = new FormControl();
        this.companyNameCtrl.valueChanges.subscribe(
            (term)=> {
                this.onSearch(term);
                this.finalInput = term;
            }
        )

        this.thirdCategortCtrl = new FormControl();
        this.thirdCategortCtrl.valueChanges.subscribe(
          (term)=>{
            this.onSearchThirdCategory(term);
          }
        )
    }
    ngOnInit(){
        this.getLevelOneCompanyCategories();
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                this.onSave();
            });
          }, 0);
        this.isLoading = false;
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

    onSave(){
        let newVendor = this.vendorForm.value;
        newVendor.name = this.finalInput;
        if(this.selectedCompany){
            newVendor.company_id = this.selectedCompany.id;
            newVendor.logo_url = this.selectedCompany.logo_url;
        }else{
            newVendor.logo_url = this.company_url;
        }

        this.categoryStoreList.splice(0, 1, this.selectedLevelOneValue);
        if(this.selectedLevelOneValue){
            this.categoryStoreList.splice(1, 2, this.selectedLevelTwoValue);
        }
        newVendor.industry = JSON.stringify(this.categoryStoreList.concat(this.thirdCategoryListChoosed));
        console.log(newVendor);
        // this.isLoading = true;
        this.leadService.addLead(this.currentLoginCompanyId, newVendor).subscribe(
            res=>{
                if(newVendor.type == 4){
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/vrm/prospect-vendor`).then(()=>{
                        this.isLoading = false;
                        this.toasterService.showToaster('Created Successfully!', '', 3000);
                    },
                    (err) => {
                        this.isLoading = false;
                        this.toasterService.showToaster(err.error.message, 'Must Input Company Name', 3000);
              })
                }else if(newVendor.type == 5){
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/vrm/backup-vendor`).then(()=>{
                        this.isLoading = false;
                        this.toasterService.showToaster('Created Successfully!', '', 3000);
                    })
                }else{
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/vrm/main-vendor`).then(()=>{
                        this.isLoading = false;
                        this.toasterService.showToaster('Created Successfully!', '', 3000);
                    })
                }
            },
            (err) => {
                this.isLoading = false;
                console.log(err.error.message);
                this.clearAllValidation();
                console.log(err.error.message)
                if(err.error.message.name == "validation.required"){
                    console.log("required");
                    this.customerNameRequired = true;
                }
                if(err.error.message.name == "validation.unique"){
                    console.log('this name already exist');
                    this.customerAlreadyExist = true;
                }
                if(err.error.message.type){
                    console.log('this filed required');
                    this.customerTypeRequired = true;
                }
                console.log(err.error.message.name,err.error.message.type);
                this.toasterService.showToaster(err.error.message.type+ ' ' + 'Fill all the field With *', '', 3000);
      }
        )
    }

    clearAllValidation(){
        this.customerAlreadyExist = false;
        this.customerNameRequired = false;
        this.customerTypeRequired = false;
    }

    createCustomerForm(){
        this.vendorForm = this.fb.group({
            name: [""],
            logo_url:[""],
            type : [''],
            industry: [''],
            company_id:[''],
            website: [''],
            telephone_number: [''],
            memo: [''],
            fax_number: [''],
            email : new FormControl('', [Validators.required, Validators.email]),
            lead_possibility:[''],
            lead_status:[''],
            lead_source:[''],
            description:[''],
            order_capacity:[''],
            contacts: this.fb.array([
                // this. initContact(),
            ]),
            addresses: this.fb.array([
                // this. initAddress(),
            ])
        });
    }

    initContact(){
       return this.fb.group({
            first_name: [''],
            last_name:[''],
            phone:[''],
            email: [''],
            type:['1'],
            position:[''],
            avatar_url:['https://orcasmart-dev.s3.us-east-2.amazonaws.com/images/DEM6o0kwR6IqaVRU1a1sPpYTdpT9sfy5AfLpMjhQ.png']

        })
    }

    initAddress(){
       return  this.fb.group({
            street1: [''],
            street2: [''],
            city: [''],
            state: [''],
            zipcode: [''],
            country: [''],
            longitude: ['1'],
            latitude: ['2']
        })
    }

    addContact(){
        const control = <FormArray>this.vendorForm['controls'].contacts;
        control.push(this.initContact());
    }

    removeContact(i: number){
        const control = <FormArray>this.vendorForm['controls'].contacts;
        control.removeAt(i);
    }

    addAddress(){
        const control = <FormArray>this.vendorForm['controls'].addresses;
        control.push(this.initAddress());
    }

    removeAddress(i: number){
        const control = <FormArray>this.vendorForm['controls'].addresses;
        control.removeAt(i);
    }

    getEmailErrorMessage() {
        return this.vendorForm.controls.email.hasError('required') ? 'You must enter a value' :
            this.vendorForm.controls.email.hasError('email') ? 'Not a valid email' :
            '';

    }

    onSearch(value){
        this.finalInput = value;
        this.searchService.searchCompany(value).subscribe(
             res=>{
                 this.companyNameList = res.data;
             }
         ) 
    }

    companySlected(company){
        this.selectedCompany = company;
        this.removeAddress(0);
        if(this.selectedCompany.address){
            this.addAddress();
            this.vendorForm.patchValue({
                addresses:[
                    {
                        street1: this.selectedCompany.address ? this.selectedCompany.address.street1: '',
                        street2: this.selectedCompany.address ? this.selectedCompany.address.street2: '',
                        city: this.selectedCompany.address ? this.selectedCompany.address.city: '',
                        state: this.selectedCompany.address ? this.selectedCompany.address.state: '',
                        zipcode: this.selectedCompany.address ? this.selectedCompany.address.zipcode: '',
                        country: this.selectedCompany.address ? this.selectedCompany.address.country: ''
                    }
                ] 
            })
        }

        if(this.selectedCompany.industry){
            
            this.selectedLevelOneValue = this.getLevelOneCategory(this.selectedCompany.industry)
            this.selectedLevelTwoValue =  this.getLevelTwoCategory(this.selectedCompany.industry);
            this.thirdCategoryListChoosed = this.getLevelThreeCategory(this.selectedCompany.industry);
            // console.log("indus");
            // console.log(this.selectedCompany.industry);
            // console.log(this.selectedLevelOneValue);
            // console.log(this.selectedLevelTwoValue);

        }
    }
    



        //to process the category; 
    //if not select company, just concat two string
    //if select company has industry, cut it first then change and contact
    getLevelOneCompanyCategories(){
        this.companyService.getCompanyCategories('0').subscribe(
            res=>{
                this.LevelOneCategories = res;
                // console.log(res);
            }
        )
    }

    selectedLevelOneCategory(value){
        this.selectedLevelOneId = value.id;
        // console.log(this.selectedLevelOneId);
        this.getLevelTwoCompanyCategories(this.selectedLevelOneId);
        this.selectedLevelOneValue = value.description;
    }

    getLevelTwoCompanyCategories(value){
        this.companyService.getCompanyCategories(value).subscribe(
            res=>{
                this.LevelTwoCategories = res;
            }
        )
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

    
    getSubCategoryValue(value){
        this.selectedLevelTwoValue = value.description;
        this.getLevelThreeCompanyCategories(value.id);
    }

    getLevelThreeCompanyCategories(value){
        this.companyService.getCompanyCategories(value).subscribe(
            res=>{
                this.LevelThreeCategories = res;
                // console.log(this.LevelThreeCategories);
            }
        )
    }

    //select from option
    selectOption(event){
        console.log(event);
        this.selectedCategory = event.option.value;
        // const value = (<HTMLInputElement>event.target).value;
     console.log(this.selectedCategory);
   }

    // contactCategoryValue(value){
    //     // console.log(value + '@@' + this.selectedLevelTwoValue);
    //     return value + '=>' + this.selectedLevelTwoValue;
    // }

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
    //    console.log(value);
      if ((value || '').trim()) {
        value = value.trim().toLowerCase();
        if (!this.thirdCategoryListChoosed.includes(value)) {
          this.thirdCategoryListChoosed.push(value);
        //   console.log(this.thirdCategoryListChoosed);
        }
      }
    }

    onSearchThirdCategory(term){
        this.companyService.searchCompanyCategories(22, term).subscribe(
          res=>{
            this.thirdCategorySearchedList = res;
          //   console.log(res);
          }
        )
        
      //   console.log('123');
      }

}