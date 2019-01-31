import { Component,ViewChild,OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyService } from 'app/core/services/company.service';
import { LeadService } from 'app/core/services/lead.service';
import { ImageService } from 'app/core/services/image.service';
import { QuoteService } from 'app/core/services/quote.service';
import { InventoryService } from 'app/core/services/inventory.service';
import { CommonService } from 'app/core/services/common.service';
import * as moment from 'moment';
import { DialogService } from 'app/core/services/dialog.service';
import { SearchService } from 'app/core/services/search.service';
import { Location } from '@angular/common';

@Component({
    selector:'edit-salesentity',
    templateUrl:'edit-salesentity.component.html',
    styleUrls:['edit-salesentity.component.scss']
})

export class EditSalesentityComponent implements OnInit{
    
    @ViewChild(SignaturePad) signaturePad: SignaturePad;
    quoteForm: FormGroup;
    productForm: FormGroup;
    productCtrl: FormControl;
    sigUrl;
    currentQuoteInfo;
    showSigImg = false;
    currentLoginCompanyId;
    currentSalesentity_id
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
    billingAddress;
    billingAddressSelected;
    showBillingAddressModal:boolean = false;
    shippingAddress;
    shippingAddressSelected;
    showShippingAddressModal: boolean = false;
    salesEntityType;
    currentWholeUrl;
    selectedProduct;
    itemPrice =null;
    itemEstPrice;
    productValueList;
    wareHouseList;
    // showSignatureBegin:boolean = false;
    // defaultAddress;
    shipViaList =['Ocean Freight', 'Air Freight', 'Groud', '2nd Day', '3nd Day', 'Next Day','Pick Up'];
    termList = ['Net 15', 'Net 30', 'Net 60', 'Due on Receipt', 'Perpay'];
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

     constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private leadService: LeadService,
        private imageService: ImageService,
        private quoteService: QuoteService,
        private inventoryService: InventoryService,
        private commonService:CommonService,
        private dialogService: DialogService,
        private searchService: SearchService,
        private location: Location
     ) {
       this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
       this.currentCustomerId = this.route.snapshot.paramMap.get('cusid');
       if(!this.currentCustomerId){
        this.currentCustomerId = this.route.snapshot.paramMap.get('ven_id');
       }
       this.salesEntityType = this.route.snapshot.data.title;
       this.currentWholeUrl = document.URL;

       this.currentSalesentity_id = this.route.snapshot.paramMap.get('seid');

       this.isLoading = true;
       this.currentDate = new Date();
       this.createTime = this.currentDate.getMonth() + '/'+ this.currentDate.getDate()+ '/' + this.currentDate.getFullYear();
       this.validTime = this.currentDate.getMonth()+ 1 + '/'+ this.currentDate.getDate()+ '/' + this.currentDate.getFullYear();
       
       this. createQuoteForm();
       this.productCtrl = new FormControl();
       this.productCtrl.valueChanges.subscribe(
           (term)=> {
               this.onSearchProduct(term);
           }
       )
       this.initialSearchCompany();
     }

     ngOnInit(){
        setTimeout(()=>{
             const buttonClick=document.getElementById("header-submit-edit");
             buttonClick.addEventListener("click", ()=>{
                 this.onSave();
             })
         },0);

         if(this.currentCustomerId){
            // this.addByCustomerId()
         }else{
             console.log('need to select customer');
             this.isLoading = false;
         }

         this.getQuoteInfo();

    }

    getQuoteInfo(){
        this.quoteService.getQuote(this.currentLoginCompanyId , this.currentSalesentity_id).subscribe(
            res=>{
                console.log(res);
                this.currentQuoteInfo = res;
                this.billingAddressSelected = res.billing_address;
                this.shippingAddressSelected = res.shipping_address;
                this.currentCustomerId = res.customer_id;
                this.productList = res.products;
                this.isLoading = false;
                // this.addByCustomerId();
                this. getCurrentCustomerInfo();
               
            }

        )
    }
    getCurrentCustomerInfo(){
        this.leadService.getLead(this.currentLoginCompanyId,this.currentCustomerId).subscribe(
            res=>{
                this.currentCustomer = res;
                console.log( this.currentCustomer);
                this.getSelectedCompanyAddress();
            }
        )
    }

    initialSearchCompany(){
        this.companyNameCtrl = new FormControl();
        this.companyNameCtrl.valueChanges.subscribe(
            (term)=> {
                // console.log(term);
                this.onSearch(term);
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

    updateItemInfo(value){
        console.log(value);
    }











    companySlected(company){
        this.selectedCompany = company;
        this.currentCompany = company;
        // console.log(company);
        this.currentCustomerId = company.id;
        this.leadService.getLead(this.currentLoginCompanyId,this.currentCustomerId).subscribe(
            res=>{
                this.currentCustomer = res;
                console.log( this.currentCustomer);
                this.getSelectedCompanyAddress();
            }
        )

    }

    addByCustomerId(){
        this.companyService.getCompany(this.currentLoginCompanyId).subscribe(
            res=>{
                // console.log('addbycustomerid');
                this.currentCompany = res;
                // console.log(this.currentCompany);
                this.leadService.getLead(this.currentLoginCompanyId,this.currentCustomerId).subscribe(
                    res=>{
                        console.log(res);
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
                // console.log(res);
                this.customerAddresses = res.data;
                this.billingAddressSelected = this.customerAddresses[0];
                this.shippingAddressSelected = this.customerAddresses[0];
                // console.log(this.billingAddressSelected);
                // console.log(this.billingAddressSelected);
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
             shipping_method:[this.currentQuoteInfo? this.currentQuoteInfo.shipping_method:''],
             rep:['jack Zhang'],
             order_type:[this.currentQuoteInfo? this.currentQuoteInfo.order_type:''],
             sales_entity_number:['1234'],
             payment_terms:[this.currentQuoteInfo? this.currentQuoteInfo.payment_terms:''],
             po_number:[this.currentQuoteInfo? this.currentQuoteInfo.fob:''],
             total:[''],
             fob:[''],
             valid_till:[''],
             due_date:[''],
             est_delivery_date:[''],
             description:[this.currentQuoteInfo? this.currentQuoteInfo.description:''],
             signature:[''],

             customer_number:[''],
             ref_number:[''],
             shipping_terms:['1234'],
             o_code:[''],
             self_number:[''],

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
            description:[''],
            rate:[''],
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
        if(value.rate < (this.itemEstPrice/100000*0.9)){
            this.dialogService.openAlertDialog('Price too low, need Manager apporved!').subscribe(
                res=>{
                    this.showAddProductModal = false;
                    this.quoteTotalValue = 0;
                    this.productList.push(value);
                    if(this.productList){
                        for(let i = 0; i<this.productList.length; i++){
                           this.quoteTotalValue +=this.productList[i].quantity *  this.productList[i].rate; 
                        }
                    }
                    this.itemPrice = null;
                }
            )
        }else{
            this.showAddProductModal = false;
                    this.quoteTotalValue = 0;
                    this.productList.push(value);
                    if(this.productList){
                        for(let i = 0; i<this.productList.length; i++){
                           this.quoteTotalValue +=this.productList[i].quantity *  this.productList[i].rate; 
                        }
                    }
                    this.itemPrice = null;
        }
     }

     removeFromProductList(value){
        console.log(this.productList);
        const item =  this.productList.find(x=>x==value);
        const idx = this.productList.indexOf(item);
        this.productList.splice(idx, 1);
        console.log(value);
     }

     onSearchProduct(value){
        this.commonService.searchFieldOfTable(this.currentLoginCompanyId, 'inventory', 'product', 'name', value, 'desc').subscribe(
            (res) => {
              this.searchProductList = res['data'];
            }
        )
     }

     productSelected(value){
        this.selectedProduct = value;
        // console.log(this.selectedProduct);
        this.inventoryService.getProductInfo(this.currentLoginCompanyId, value.id).subscribe(
            res=>{
                this.itemPrice = res.est_sale_price/100000;
                this.itemEstPrice = res.est_sale_price;
                this.wareHouseList = res.warehouses;
                // console.log(this.wareHouseList);
                // console.log(this.itemPrice);
                // console.log(res);

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
         newQuote.valid_till = this.customEndDate();
         newQuote.total = this.quoteTotalValue;
         console.log( newQuote);
         this.quoteService.editSalesEntity(this.currentLoginCompanyId, this.currentSalesentity_id, newQuote).subscribe(
            res=>{
                this.location.back();
            }
         )
        //  this.quoteService.addQuote(this.currentLoginCompanyId, this.currentCustomerId,newQuote).subscribe(
        //      res=>{
        //         this.location.back();
        //        this.commonService.sendQuoteEmailToUSer().subscribe(
        //         res=>{
                    
        //            },
        //            (err)=>{
        //                console.log(err);
        //            }
        //        )
        //      }
        //  )
     }

/////////////////////////////// signature begin/////////////////////////////
     ngAfterViewInit() {
       // this.signaturePad is now available
       this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
       this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
     }
    
     drawComplete() {
       // will be notified of szimek/signature_pad's onEnd event
       this.sigUrl = this.signaturePad.toDataURL();
    //    console.log(this.signaturePad.toDataURL());
       this.showSigImg = true;
       const formData = this.imageService.urltoFormData(this.signaturePad.toDataURL());
       this.imageService.uploadImage(formData).subscribe(
           res=>{
               this.signatureUrl = res.url;
            //    console.log(res);
            //    console.log(res.url);
           }
       )

     }
    
     drawStart() {
       // will be notified of szimek/signature_pad's onBegin event
    //    console.log('begin drawing');
     }

     clearPad(){
        this.signaturePad.clear();
     }

     closePad(){
         this.sigModal = false;
     }
     openPad(){
        this.sigModal = true;
     }
     sigModel(){
        this.sigModal = true;
     }
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
        this.showBillingAddressModal = false;
        this.showShippingAddressModal = false;
    }
}