import { Component,ViewChild,OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyService } from 'app/core/services/company.service';
import { LeadService } from 'app/core/services/lead.service';
import { ImageService } from 'app/core/services/image.service';
import { QuoteService } from 'app/core/services/quote.service';
import { SharedService } from 'app/core/services/shared.service';
import { InventoryService } from 'app/core/services/inventory.service';
import { CommonService } from 'app/core/services/common.service';
import * as moment from 'moment';
import { DialogService } from 'app/core/services/dialog.service';
import { SearchService } from 'app/core/services/search.service';
import { Location } from '@angular/common';
import { QuoteSettingService } from 'app/core/services/quote-setting.service';
import { AuthService } from 'app/core/services/auth.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';


@Component({ 
    selector:'add-quote',
    templateUrl:'add-quote.component.html',
    styleUrls:['add-quote.component.scss']
})

export class AddQuoteComponent implements OnInit{

    @ViewChild(SignaturePad) signaturePad: SignaturePad;
    quoteForm: FormGroup;
    productForm: FormGroup;
    productCtrl: FormControl;
    sigUrl;
    showSigImg = false;
    currentLoginCompanyId;
    currentCustomerId;
    currentCompany;
    currentCustomer;
    createTime;
    validTime;
    isLoading;
    productList = [];
    signatureUrl;
    sigModal = true;
    currentDate;
    selectedProductId;
    showAddProductModal:boolean = false;
    searchProductList ;
    quoteTotalValue:number =0;
    customerAddresses;
    shippingAddress;
    billingAddress;
    billingAddressSelected;
    showBillingAddressModal:boolean = false;

    shippingAddressSelected;
    showShippingAddressModal: boolean = false;
    salesEntityType;
    currentWholeUrl;
    selectedProduct;
    selectedWareHouse;
    itemPrice =null;
    originalPrice;
    itemEstPrice;
    productValueList;
    wareHouseList;
    // showSignatureBegin:boolean = false;
    // defaultShippingAddress;
    // defaultBilingAddress;
    shipViaList ;
    termList ;
    ordertypeList = ['Drop Ship', 'From Stock'];
    
    signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
       'minWidth': 1,
       'canvasWidth': 260,
       'canvasHeight': 100
    };

    //search company
    companyNameCtrl : FormControl;
    searchCompanyInput;
    companyNameUserInput;
    companyNameList;
    selectedCompany;

    sendAndSaveQuote = 1;
    requestAndSaveQuote = 1;
    quoteNotes;

    //note form 
    noteForm: FormGroup;
    AddNoteModal:boolean = false;
    currentLoginUserId;
    customerContacts;
    defaultCustomerContact;
    selectedAccountCustomer;
    showAccountContactModal: boolean = false;

     constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private leadService: LeadService,
        private imageService: ImageService,
        private quoteService: QuoteService,
        private sharedService: SharedService,
        private inventoryService: InventoryService,
        private commonService:CommonService,
        private dialogService: DialogService,
        private searchService: SearchService,
        private location: Location,
        private quoteSettingService: QuoteSettingService,
        private authService: AuthService,
        private departmentOpportunityService: DepartmentOpportunityService,   
        
     ) {
        // console.log(new Date().valueOf());
       this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
       this.currentCustomerId = this.route.snapshot.paramMap.get('cusid');

       if(!this.currentCustomerId){
        this.currentCustomerId = this.route.snapshot.paramMap.get('ven_id');
       }

       this.salesEntityType = this.route.snapshot.data.title;
       this.currentWholeUrl = document.URL;

       this.isLoading = true;
       this.currentDate = new Date();
       this.createTime = this.currentDate.getMonth() + '/'+ this.currentDate.getDate()+ '/' + this.currentDate.getFullYear();
       this.validTime = this.currentDate.getMonth()+ 1 + '/'+ this.currentDate.getDate()+ '/' + this.currentDate.getFullYear();
       this.createQuoteForm();
       this.createNoteForm();
       this.productCtrl = new FormControl();
       this.productCtrl.valueChanges.subscribe(
           (term)=> {
               this.onSearchProduct(term);
           }
       )
       this.initialSearchCompany();

       console.log(JSON.parse(localStorage.getItem('quoteNotes')));
       if(JSON.parse(localStorage.getItem('quoteNotes'))){
           this.quoteNotes = JSON.parse(localStorage.getItem('quoteNotes'));
       }
     }

     ngOnInit(){
        console.log(this.sharedService.quoteNotes);
        setTimeout(()=>{
             const buttonClick=document.getElementById("header-submit-edit");
             buttonClick.addEventListener("click", ()=>{
                 
                if(this.quoteForm.status =='VALID'){
                     this.onSave();
                }else{
                    let message = 'Please select quote type!';
                    this.dialogService.openAlertDialog(message);
                }
             })
         },0);

         if(this.currentCustomerId){
            this.addByCustomerId()
         }else{
             console.log('need to select customer');
             this.isLoading = false;
         }
         this.getCurrentUserId();
         this.getQuoteSettingShipVia();
         this.getQuoteSettingPayterm();
         this. getCustomerContacts();

    }

    getCurrentUserId(){
        this.authService.getCurrentUser().subscribe(
            res=>{
                this.currentLoginUserId = res.user.id;
                // console.log(this.currentLoginUserId);
            })
    }

    getCustomerContacts(){
        this.leadService.getLeadContacts(this.currentLoginCompanyId, this.currentCustomerId).subscribe(
            res=>{
                this.customerContacts = res.data;
                if(this.customerContacts.length>0){
                    this.selectedAccountCustomer = this.customerContacts[0]
                    this.defaultCustomerContact = this.customerContacts[0];
                }
                console.log(this.customerContacts);
            }
        )
    }

    selectAccountContact(value){
        console.log(value);
        this.selectedAccountCustomer = value;
        console.log(this.defaultCustomerContact);
    }

    openAccountContactModal(){
        console.log('change contact');
        this.showAccountContactModal = true;
    }

    cancelSelecteContact(){
        this.selectedAccountCustomer = this.defaultCustomerContact;
        this.showAccountContactModal = false;
    }
    confirmContact(){
        this.defaultCustomerContact = this.selectedAccountCustomer;
        this.showAccountContactModal = false;
    }

    fixNumberQty(value, number){
        return parseFloat(value).toFixed(number)
    }

    initialSearchCompany(){
        this.companyNameCtrl = new FormControl();
        this.companyNameCtrl.valueChanges.subscribe(
            (term)=> {
                console.log(term);
                this.onSearch(term);
                // this.searchCompanyInput = term;
            }
        )
     }

     getQuoteSettingPayterm(){
        this.quoteSettingService.quotesSettingGetPayterm(this.currentLoginCompanyId).subscribe(
            res=>{
                console.log(res);
                this.termList = res;
            }
        )
    }

    getQuoteSettingShipVia(){
        this.quoteSettingService.quotesSettingGetShipVia(this.currentLoginCompanyId).subscribe(
            res=>{
                this.shipViaList = res;
            }
        )
    }

    onSearch(value){
        this.companyNameUserInput = value;
        this.searchService.searchCRMCompany(this.currentLoginCompanyId ,value, false).subscribe(
             res=>{
                 this.companyNameList = res.data;
                //  console.log(res.data);
             }
         ) 
    }

    companySlected(company){
        this.selectedCompany = company;
        this.currentCompany = company;
        console.log(company);
        this.currentCustomerId = company.id;
        this.leadService.getLead(this.currentLoginCompanyId,this.currentCustomerId).subscribe(
            res=>{
                this.currentCustomer = res;
                this.getSelectedCompanyAddress();
            }
        )

    }

    quantityChange(evt){
        console.log(evt);
        console.log(evt.target.value);
        if(this.quoteForm.value.order_type == 'From Stock'){
            this.quoteService.getProductPriceWithProductIdAndWarehouseId(this.currentLoginCompanyId, this.selectedWareHouse.id, this.selectedProduct.id,  evt.target.value ).subscribe(
                res=>{
                    this.itemPrice = res/100000;
                    this.originalPrice = res/100000;
                    this.itemEstPrice = res;
                    console.log(res);
                }
            )
        }else{
            
        }
        
    }

    wareHouseSelected(value){
        this.selectedWareHouse = value;
        console.log(value.id);
    }

    addByCustomerId(){
        this.companyService.getCompany(this.currentLoginCompanyId).subscribe(
            res=>{
                console.log('addbycustomerid');
                this.currentCompany = res;
                console.log(this.currentCompany);
                this.leadService.getLead(this.currentLoginCompanyId,this.currentCustomerId).subscribe(
                    res=>{
                        this.currentCustomer = res;
                        this.getSelectedCompanyAddress();
                    }
                )
                
            }
        ); 
    }

    getSelectedCompanyAddress(){
        this.leadService.getLeadAddresses(this.currentLoginCompanyId, this.currentCustomerId).subscribe(
            res=>{
                console.log(res);
                this.customerAddresses = res.data;
                this.shippingAddress = this.customerAddresses[0];
                this.billingAddress = this.customerAddresses[0];
                this.billingAddressSelected = this.customerAddresses[0];
                this.shippingAddressSelected = this.customerAddresses[0];
                console.log(this.billingAddressSelected);
                console.log(this.billingAddressSelected);
                this.isLoading= false;
            }
        )
    }

    createQuoteForm(){
         this.quoteForm = this.fb.group({
             customer_id:[''],
             billing_address_id:[''],
             shipping_address_id:[''],
             type:['1'],
             shipping_method:[''],
             rep:[''],
             order_type:[''],
             sales_entity_number:[''],
             payment_terms:[''],
            //  po_number:[''],
             total:[''],
             fob:[''],
            //  valid_till:[''],
             due_date:[''],
             est_delivery_date:[''],
             description:[''],
             signature:[''],
             approve_status:[''],
             customer_number:[''],
             ref_number:[''],
             shipping_terms:['1234'],
             o_code:[''],
             self_number:[''],
             customer_name:[''],
             account_contact_id:[''],
             old_new:[''],
            //  total_value:[''],
             note_subject:Object,

             products: this.fb.array([

             ])
         })
     }

    //  initProduct(){
    //      return this.fb.group({
    //          product_id:[''],
    //          quantity:[''],
    //          rate:[''],
    //      })
    //  }
    createProductForm(){
         this.productForm = this.fb.group({
            product_id:[''],
            name:[''],
            quantity:[''],
            warehouse_name:[''],
            warehouse_id:[''],
            description:[''],
            rate:[''],
            img_url:[''],
            original_rate:[''],
            approved: ['']

        })
     }

    /*----------------------open add product modal------------------------------*/
    addProductModal(){
        this.createProductForm();
        this.showAddProductModal = true;
        this.selectedProduct =null;
        this.productCtrl = new FormControl();
       this.productCtrl.valueChanges.subscribe(
           (term)=> {
               this.onSearchProduct(term);
           }
       )
     }

    reomoveProduct(i: number){
        const control = <FormArray>this.quoteForm['controls'].products;
        control.removeAt(i);
     }

    cancelAddProduct(){
        this.showAddProductModal = false;
        this.itemPrice = null;
    }

    addProduct(value){
        console.log(value);
        if(value.rate < (this.itemEstPrice/100000*0.9)){
            this.dialogService.openAlertDialog('Price too low, need Manager apporved!').subscribe(
                res=>{
                    this.showAddProductModal = false;
                    this.quoteTotalValue = 0;
                    value.approved = 0;
                    this.productList.push(value);
                    console.log(this.productList);
                    if(this.productList){
                        for(let i = 0; i<this.productList.length; i++){
                           this.quoteTotalValue +=this.productList[i].quantity *  this.productList[i].rate; 
                           this.sendAndSaveQuote = this.sendAndSaveQuote*this.productList[i].approved;
                        }
                    }
                    this.itemPrice = null;
                }
            )
        }else{
            this.showAddProductModal = false;
            this.quoteTotalValue = 0;
            value.approved = 1;
            console.log(value);
            this.productList.push(value);
            console.log(this.productList);
            if(this.productList){
                for(let i = 0; i<this.productList.length; i++){
                    this.quoteTotalValue +=this.productList[i].quantity *  this.productList[i].rate; 
                    this.sendAndSaveQuote = this.sendAndSaveQuote*this.productList[i].approved;
                //    this.requestAndSaveQuote = this.sendAndSaveQuote*this.productList[i].approved;
                }
            }
            console.log(this.sendAndSaveQuote);
            this.itemPrice = null;
        }
     }

    onSearchProduct(value){
        const headlineValue = 'headline='+value;
        this.searchService.searchProduct(this.currentLoginCompanyId, headlineValue).subscribe(
            (res) => {
                    this.searchProductList = res['data'];
                    console.log(res);
                  },
                  err=>{
                      console.log(err);
                  }
        )
        // this.commonService.searchFieldOfTable(this.currentLoginCompanyId, 'inventory', 'product', 'name', value, 'desc').subscribe(
        //     (res) => {
        //       this.searchProductList = res['data'];
        //     }
        // )
     }

    productSelected(value){
        this.selectedProduct = value;
        this.inventoryService.getProductInfo(this.currentLoginCompanyId, value.id).subscribe(
            res=>{
                this.originalPrice = res.est_sale_price/100000;
                this.itemPrice = res.est_sale_price/100000;
                this.itemEstPrice = res.est_sale_price;
                this.wareHouseList = res.warehouses;
                console.log(this.wareHouseList);
                // console.log(this.itemPrice);
                console.log(res);
            }
        )
     }

     getWareHouseListByProduct(){
        //  this.inventoryService.g
     }

    customEndDate(){
        return moment(this.currentDate).add(30,'days').endOf('day').format("YYYY-MM-DD");
    }

    currentformDate(){
        return moment(this.currentDate).format("YYYY-MM-DD");
    }

    removeFromProductList(value){
        console.log(this.productList);
        const item =  this.productList.find(x=>x==value);
        const idx = this.productList.indexOf(item);
        this.productList.splice(idx, 1);

        if(this.productList.length){
            for(let i = 0; i<this.productList.length; i++){
               this.quoteTotalValue +=this.productList[i].quantity *  this.productList[i].rate; 
               this.sendAndSaveQuote = this.sendAndSaveQuote*this.productList[i].approved;
            }
        }else{
            this.sendAndSaveQuote = 1;
            console.log(this.sendAndSaveQuote);
        }
     }

     onSave(){
         let newQuote = this.quoteForm.value;
         if(this.signatureUrl){
            newQuote.signature =  this.signatureUrl;
         }
         if(this.billingAddress){
            newQuote.billing_address_id = this.billingAddress.id;
         }else{
            newQuote.billing_address_id = this.billingAddressSelected.id;
         }
         if(this.shippingAddress){
            newQuote.shipping_address_id = this.shippingAddress.id;
         }else{
            newQuote.shipping_address_id = this.shippingAddressSelected.id;
         }

         newQuote.products = this.productList;
         if(this.salesEntityType== 'Add Quote'){
            newQuote.type = 1;
         }
         if(this.salesEntityType== 'Add SalesOrder'){
            newQuote.type = 2;
         }
         if(this.salesEntityType== 'Add Invoice'){
            newQuote.type = 3;
         }
         if(this.defaultCustomerContact){
            newQuote.account_contact_id = this.defaultCustomerContact.id;
         }
         newQuote.note_subject = this.quoteNotes;
         newQuote.rep = this.currentLoginUserId;

         newQuote.sales_entity_number = new Date().valueOf();
        //  newQuote.valid_till = this.customEndDate();
         newQuote.total = this.quoteTotalValue;
         console.log(newQuote);
        
         this.quoteService.addQuote(this.currentLoginCompanyId, this.currentCustomerId,newQuote).subscribe(
             res=>{
              
                this.location.back();  
                 // after add-quote, update the total of the quote to the completed_opportunity_dollar_amount of sales project, editted by yali
                //  let request = {
                //      'completed_opportunity_dollar_amount' : res.total,
                //  }

                //  this.departmentOpportunityService.updateProjectOpportunityValue(this.currentLoginCompanyId, request).subscribe(
                //      res => {
                //         this.location.back();                        
                //      }
                //  )

            //     this.commonService.sendQuoteMessageToUSer().subscribe(
            //        res=>{
                    
            //        },
            //        (err)=>{
            //            console.log(err);
            //        }
            //    );

            //    this.commonService.sendQuoteEmailToUSer().subscribe(
            //     res=>{
                    
            //        },
            //        (err)=>{
            //            console.log(err);
            //        }
            //    )
             }
         )
     }

     //save and required approve 
     saveAndRequiredApproved(){
         
        let newQuote = this.quoteForm.value;
        
        if(this.signatureUrl){
           newQuote.signature =  this.signatureUrl;
        }
        if(this.billingAddress){
           newQuote.billing_address_id = this.billingAddress.id;
        }else{
           newQuote.billing_address_id = this.billingAddressSelected.id;
        }
        if(this.shippingAddress){
           newQuote.shipping_address_id = this.shippingAddress.id;
        }else{
           newQuote.shipping_address_id = this.shippingAddressSelected.id;
        }

        newQuote.products = this.productList;
        if(this.salesEntityType== 'Add Quote'){
           newQuote.type = 1;
        }
        if(this.salesEntityType== 'Add SalesOrder'){
           newQuote.type = 2;
        }
        if(this.salesEntityType== 'Add Invoice'){
           newQuote.type = 3;
        }
        if(!this.sendAndSaveQuote){
            newQuote.approve_status = 'NeedApproved';
        }
        
        newQuote.note_subject = this.quoteNotes;
        newQuote.sales_entity_number = new Date().valueOf();
        // newQuote.valid_till = this.customEndDate();
        newQuote.total = this.quoteTotalValue;
        this.quoteService.addQuote(this.currentLoginCompanyId, this.currentCustomerId,newQuote).subscribe(
            res=>{
              
                this.location.back();
                // after add-quote, update the total of the quote to the completed_opportunity_dollar_amount of sales project, editted by yali
                // let request = {
                //     'completed_opportunity_dollar_amount' : res.total,
                // }

                // this.departmentOpportunityService.updateProjectOpportunityValue(this.currentLoginCompanyId, request).subscribe(
                //     res => {
                //        this.location.back();                        
                //     }
                // )
           //    this.commonService.sendQuoteMessageToUSer().subscribe(
           //        res=>{
                   
           //        },
           //        (err)=>{
           //            console.log(err);
           //        }
           //    )
            //   this.commonService.sendQuoteEmailToUSer().subscribe(
            //    res=>{
                   
            //       },
            //       (err)=>{
            //           console.log(err);
            //       }
            //   )
            }
        )
     }
     //send the quote and notify the customer you selected
     sendAndNotifyCustomer(){
        let newQuote = this.quoteForm.value;
        
        if(this.signatureUrl){
           newQuote.signature =  this.signatureUrl;
        }
        if(this.billingAddress){
           newQuote.billing_address_id = this.billingAddress.id;
        }else{
           newQuote.billing_address_id = this.billingAddressSelected.id;
        }
        if(this.shippingAddress){
           newQuote.shipping_address_id = this.shippingAddress.id;
        }else{
           newQuote.shipping_address_id = this.shippingAddressSelected.id;
        }

        newQuote.products = this.productList;
        if(this.salesEntityType== 'Add Quote'){
           newQuote.type = 1;
        }
        if(this.salesEntityType== 'Add SalesOrder'){
           newQuote.type = 2;
        }
        if(this.salesEntityType== 'Add Invoice'){
           newQuote.type = 3;
        }
        if(this.sendAndSaveQuote){
            newQuote.approve_status = 'Send';
        }
        // newQuote.note_subject = this.quoteNotes;
        
        newQuote.sales_entity_number = new Date().valueOf();
        // newQuote.valid_till = this.customEndDate();
        newQuote.total = this.quoteTotalValue;

        this.quoteService.addQuote(this.currentLoginCompanyId, this.currentCustomerId,newQuote).subscribe(
            res=>{
                // after add-quote, update the total of the quote to the completed_opportunity_dollar_amount of sales project, editted by yali
                let request = {
                    'completed_opportunity_dollar_amount' : res.total,
                }

                this.departmentOpportunityService.updateProjectOpportunityValue(this.currentLoginCompanyId, request).subscribe(
                    res => {
                    
                        this.location.back();                        
                    }
                )
           //    this.commonService.sendQuoteMessageToUSer().subscribe(
           //        res=>{
                   
           //        },
           //        (err)=>{
           //            console.log(err);
           //        }
           //    )

            //   this.commonService.sendQuoteEmailToUSer().subscribe(
            //    res=>{
                   
            //       },
            //       (err)=>{
            //           console.log(err);
            //       }
            //   )
            }
        )
     }

     getNoteContent(desciption) {
        return JSON.parse(desciption);
    }

    //create note form 
    createNoteForm() {
        this.noteForm = this.fb.group({
          public: [1],
          name: [''],
          description: this.fb.array([
            this.initSubNote()
          ])
        });
    }

    initSubNote() {
        return this.fb.group({
          img: [''],
          text: [''],
        });
    }

    openAddNoteModal(){
        this.AddNoteModal = true;
        console.log('add note model');
    }

    addQuoteNote(){
        // this.createNoteForm();
        this.AddNoteModal = false;
        this.noteForm.value.description = JSON.stringify(this.noteForm.value.description);
        this.quoteNotes = this.noteForm.value;
      
        console.log(this.noteForm.value);
    }

    cancelAddQuteModal(){
        this.AddNoteModal = false;
    }

     

/////////////////////////////// signature begin/////////////////////////////
    //  ngAfterViewInit() {
    //    // this.signaturePad is now available
    //    this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
    //    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    //  }
    
    //  drawComplete() {
    //    // will be notified of szimek/signature_pad's onEnd event
    //    this.sigUrl = this.signaturePad.toDataURL();
    // //    console.log(this.signaturePad.toDataURL());
    //    this.showSigImg = true;
    //    const formData = this.imageService.urltoFormData(this.signaturePad.toDataURL());
    //    this.imageService.uploadImage(formData).subscribe(
    //        res=>{
    //            this.signatureUrl = res.url;
    //         //    console.log(res);
    //         //    console.log(res.url);
    //        }
    //    )

    //  }
    
    //  drawStart() {
    //    // will be notified of szimek/signature_pad's onBegin event
    // //    console.log('begin drawing');
    //  }

    //  clearPad(){
    //     this.signaturePad.clear();
    //  }

    //  closePad(){
    //      this.sigModal = false;
    //  }
    //  openPad(){
    //     this.sigModal = true;
    //  }
    //  sigModel(){
    //     this.sigModal = true;
    //  }
////////////////////////////////////////////////signature end////////////////////////////////
/************************************selected shipping address and billing address************************************************* */

    selectBillingAddress(address){
        this.billingAddressSelected = address;
        // console.log(this.billingAddressSelected);
    }
    comfirmBillingAddress(){
        this.billingAddress = this.billingAddressSelected;
        this.showBillingAddressModal = false;
        // console.log(this.billingAddress );
    }
    selectShippingAddress(address){
        this.shippingAddressSelected = address;
        // console.log( this.shippingAddressSelected);
    }
    confirmShippingAddress(){
        this.shippingAddress = this.shippingAddressSelected;
        // console.log( this.shippingAddress);
        this.showShippingAddressModal = false;
    }
    openBillingAddressModal(){
        this.showBillingAddressModal = true;
        this.showShippingAddressModal = false;
    }
    openShippingAddressModal(){
        this.showBillingAddressModal = false;
        this.showShippingAddressModal = true;
    }

    cancelSelecteAddress(){
        this.billingAddressSelected = this.billingAddress;
        this.shippingAddressSelected = this.shippingAddress;
        this.showBillingAddressModal = false;
        this.showShippingAddressModal = false;
    }
}