import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
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
    selector:'add-customer',
    templateUrl:'add-customer.component.html',
    styleUrls:['add-customer.component.scss']
})

export class AddCustomerComponent implements OnInit{
    companyNameCtrl : FormControl;
    userInput;
    finalInput;
    companyNameList;
    selectedCompany;
    customerForm: FormGroup;
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
    
    newStreetTypes;
    totalStreetTypes;
    newZipCodeInfo;
    totalZipCodeInfo;
    selectedZipInfo;
    googleAddress;
    customerAlreadyExist:boolean = false;
    customerNameRequired:boolean = false;
    customerTypeRequired:boolean = false;

    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    // industry type 
    LevelOneCategories;
    selectedLevelOneId;
    LevelTwoCategories;
    selectedLevelTwoValue;
    selectedLevelOneValue;
    selectedLevelThreeValue;
    LevelThreeCategories;

    // testArray: any =[];

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
        private companyService : CompanyService

    ){
        //setting crop image begin
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = 350;
        this.cropperSettings.height = 350;
        this.cropperSettings.dynamicSizing = true;
        this.data = {};
        //setting crop image end
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this. createCustomerForm();
        this.isLoading = true;

        this.companyNameCtrl = new FormControl();
        this.companyNameCtrl.valueChanges.subscribe(
            (term)=> {
                // console.log(term);
                this.onSearch(term);
                this.finalInput = term;
            }
        )
        this.thirdCategortCtrl = new FormControl();
        this.thirdCategortCtrl.valueChanges.subscribe(
          (term)=>{
            // console.log(123);
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

        this.streetTypesService.getStreetTypes().subscribe(
            res=>{
                this.newStreetTypes = res;
                this.totalStreetTypes = res;
            }
        );
        
        this.zipCodeService.getZipCodeAddress('11111').subscribe(
            res=>{
                // console.log(res);
            }
        )
        this.isLoading = false;
    }

    onSearch(value){
        this.userInput = value;
        this.searchService.searchCompany(value).subscribe(
             res=>{
                 this.companyNameList = res.data;
                //  console.log(res.data);
             }
         ) 
    }


    companySlected(company){
        // console.log('------------------------------------');
        this.selectedCompany = company;
        this.removeAddress(0);
        if(this.selectedCompany.address){
            this.addAddress();
            this.customerForm.patchValue({
                addresses:[
                    {
                        street1: this.selectedCompany.address ? this.selectedCompany.address.street1: '',
                        street2: this.selectedCompany.address ? this.selectedCompany.address.street2: '',
                        city: this.selectedCompany.address ? this.selectedCompany.address.city: '',
                        state: this.selectedCompany.address ? this.selectedCompany.address.state: '',
                        zipcode: this.selectedCompany.address ? this.selectedCompany.address.zipcode: '',
                        country: this.selectedCompany.address ? this.selectedCompany.address.country: '',
                        // type: this.selectedCompany.address ? this.selectedCompany.address.type: ''
                    }
                ] 
            })
        }

        if(this.selectedCompany.industry){
            this.selectedLevelOneValue = this.getLevelOneCategory(this.selectedCompany.industry)
            this.selectedLevelTwoValue =  this.getLevelTwoCategory(this.selectedCompany.industry);
            this.thirdCategoryListChoosed = this.getLevelThreeCategory(this.selectedCompany.industry);
        }
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

  test(value){
    this.zipCodeService.getZipCodeAddress(value).subscribe(
        res=>{
            // console.log(res.results[0].address_components[0].long_name);
            // console.log(res.results[0].address_components[1].long_name);
            // console.log(res.results[0].address_components[2].long_name);
            // console.log(res.results[0].address_components[3].long_name);
            // console.log(res.results[0].address_components[4].long_name);
            // console.log(res.results[0].address_components[5].long_name);
            this.googleAddress = res;

        }
    )
  }

    onSave(){
        this.isLoading = true;
        let newCustomer = this.customerForm.value;
        newCustomer.name = this.finalInput;
    //    console.log(newCustomer);
        if(this.selectedCompany){
            newCustomer.company_id = this.selectedCompany.id;
            if(this.selectedCompany.logo_url){
                newCustomer.logo_url = this.selectedCompany.logo_url;
            }else{
                newCustomer.logo_url = this.company_url;
            }
        }else{
            newCustomer.logo_url = this.company_url;
            
        }
        // newCustomer.industry =  this.selectedLevelOneValue + '=>' + this.selectedLevelTwoValue;
        this.categoryStoreList.splice(0, 1, this.selectedLevelOneValue);
        if(this.selectedLevelOneValue){
            this.categoryStoreList.splice(1, 2, this.selectedLevelTwoValue);
        }
        newCustomer.industry = JSON.stringify(this.categoryStoreList.concat(this.thirdCategoryListChoosed));
        // console.log(this.thirdCategoryListChoosed);
        // console.log(newCustomer);
        
        // console.log(newCustomer);
        this.leadService.addLead(this.currentLoginCompanyId, newCustomer).subscribe(
            res=>{
                if(newCustomer.type == 1){
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/crm/lead`).then(()=>{
                        this.isLoading = false;
                        this.toasterService.showToaster('Created Successfully!', '', 3000);
                    },
                    (err) => {
                        this.isLoading = false;
                        this.toasterService.showToaster(err.error.message, 'Must Input Company Name', 3000);
              })
                }else if(newCustomer.type == 2){
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/crm/potential`).then(()=>{
                        this.isLoading = false;
                        this.toasterService.showToaster('Created Successfully!', '', 3000);
                    })
                }else{
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/crm/account`).then(()=>{
                        this.isLoading = false;
                        this.toasterService.showToaster('Created Successfully!', '', 3000);
                    })
                }
            },
            (err) => {
                this.isLoading = false;
                this.clearAllValidation();
                // console.log(err.error.message)
                if(err.error.message.name == "validation.required"){
                    // console.log("required");
                    this.customerNameRequired = true;
                }
                if(err.error.message.name == "validation.unique"){
                    // console.log('this name already exist');
                    this.customerAlreadyExist = true;
                }
                if(err.error.message.type){
                    // console.log('this filed required');
                    this.customerTypeRequired = true;
                }
                // console.log(err.error.message.name,err.error.message.type);
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
        this.customerForm = this.fb.group({
            name: [''],
            logo_url:[''],
            company_id:[''],
            memo:[''],
            type : [''],
            industry: [''],
            website: [''],
            telephone_number: [''],
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
                // this.initAddress(),
            ])
        });
    }

    initContact(){
       return this.fb.group({
            first_name: [''],
            last_name:[''],
            phone:[''],
            type:['1'],
            email: [''],
            position:[''],
            avatar_url:['https://orcasmart-dev.s3.us-east-2.amazonaws.com/images/DEM6o0kwR6IqaVRU1a1sPpYTdpT9sfy5AfLpMjhQ.png']

        })
    }
    //
    initAddress(){
       return  this.fb.group({
            street1: [''],
            street2: [''],
            city: [''],
            state: [''],
            zipcode: [''],
            country: [''],
            type:['']
        })
    }

    addContact(){
        const control = <FormArray>this.customerForm['controls'].contacts;
        control.push(this.initContact());
    }

    removeContact(i: number){
        const control = <FormArray>this.customerForm['controls'].contacts;
        control.removeAt(i);
    }

    addAddress(){
        const control = <FormArray>this.customerForm['controls'].addresses;
        control.push(this.initAddress());
    }

    removeAddress(i: number){
        const control = <FormArray>this.customerForm['controls'].addresses;
        control.removeAt(i);
    }

    getEmailErrorMessage() {
        return this.customerForm.controls.email.hasError('required') ? 'You must enter a value' :
            this.customerForm.controls.email.hasError('email') ? 'Not a valid email' :
            '';

    }

    streetTypeFilter(value){
        // const value = (<HTMLInputElement>event.target).value;
        this.newStreetTypes = this.totalStreetTypes.filter(function(el){
                return el.Name.toLowerCase().indexOf(value.toLowerCase()) > -1
            } 
        )

        // console.log(value);
    }

    //select from option
    selectOption(event){
        this.selectedCategory = event.option.value;
        //  const value = (<HTMLInputElement>event.target).value;
         console.log(event);
        //  console.log();
    }

    getAddressCode(value){
        this.zipCodeService.getZipCodeAddress(value).subscribe(
            res=>{
            }
        )
    }

    zipCodeInfo(value){
        this.newStreetTypes = this.totalStreetTypes.filter(function(el){
                return el.Name.toLowerCase().indexOf(value.toLowerCase()) > -1
            } 
        )
        this.selectedZipInfo;
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
        // console.log(value);
        this.companyService.getCompanyCategories(value).subscribe(
            res=>{
                this.LevelTwoCategories = res;
            }
        )
    }

    getLevelThreeCompanyCategories(value){
        this.companyService.getCompanyCategories(value).subscribe(
            res=>{
                this.LevelThreeCategories = res;
                // console.log(this.LevelThreeCategories);
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

    // getThirdLevelCategoryValue(value){
    //     console.log(value);
    //     this.selectedLevelThreeValue = value.description;
    //     // console.log(this.selectedLevelThreeValue);
    //     // console.log(value);
    // }

    contactCategoryValue(value){
        // console.log(value + '@@' + this.selectedLevelTwoValue);
        return value + '=>' + this.selectedLevelTwoValue;
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

    // formatPhoneNumber(evt){
    //     console.log(evt.target.value);
    //     var cleaned = ('' + evt.target.value).replace(/\D/g, '')
    //     var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    //     if (match) {
    //         console.log('(' + match[1] + ') ' + match[2] + '-' + match[3])
    //         return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    //     }
    //     return null

    // }


    

}