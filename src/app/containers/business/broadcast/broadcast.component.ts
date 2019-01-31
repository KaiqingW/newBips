import { Component,OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BroadcastService } from 'app/core/services/broadcast.service';
import { CommonService } from 'app/core/services/common.service';
import { environment } from 'environments/environment';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { SearchService } from 'app/core/services/search.service';

@Component({
    selector:'broadcast',
    templateUrl:'broadcast.component.html',
    styleUrls:['broadcast.component.scss']
})

export class BroadcastComponent implements OnInit{

    currentLoginCompanyId;
    companyContacts:any;
    isLoading = false;
    contactList=[];
    formmatModalOpen:boolean = false;
    broadcastForm: FormGroup;
    currentType = 'lead';

    //define for paginate
    currentPage=1;
    lastPageUrl;
    nextPageUrl;
    //jump by page number
    defaultUrl;

    productCtrl: FormControl;
    searchProductList;
    itemList = [];
    selectedProduct;

    showAddProductModal: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private broadcastService : BroadcastService,
        private commonService : CommonService,
        private fb: FormBuilder,
        private searchService: SearchService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.currentType = this.route.snapshot.paramMap.get('bctype');
        console.log(this.currentType);
        this.isLoading = true;
        this.createBroadcastForm();
        this.defaultUrl = environment.ORCA_API+`company/${this.currentLoginCompanyId}/broadcast?q=${this.currentType}&page=`;
        
        this.productCtrl = new FormControl();
        this.productCtrl.valueChanges.subscribe(
            (term)=> {
                this.onSearchProduct(term);
            }
        )
    }
    
    ngOnInit(){
       this.getBroadcastList(this.currentType);
    }

    createBroadcastForm(){
        this.broadcastForm = this.fb.group({
            emails:[''],
            subject:[''],
            content:[''],
            items:['']
        })
    }

    getBroadcastList(value){
        this.defaultUrl = environment.ORCA_API+`company/${this.currentLoginCompanyId}/broadcast?q=${value}&page=`;
        this.isLoading = true;
        this.broadcastService.getContactList(this.currentLoginCompanyId, value).subscribe(
            res=>{
                this.companyContacts = res.data;
                this.lastPageUrl = res.paging.previous
                this.nextPageUrl = res.paging.next
                this.currentPage = res.paging.currentPage;
                this.isLoading = false;
            }
        )
    }

    selectAll(){
        var items = document.getElementsByName('acs');
        // console.log(items);
        for(var i=0; i<items.length; i++){
            let ckbox = <HTMLInputElement>items[i];
            ckbox.checked = true;
            if(!this.contactList.includes(ckbox.value)){
                this.contactList.push(ckbox.value);
            }
        }
        // console.log( this.contactList);
    }

    unSelectAll(){
        var items = document.getElementsByName('acs');
        for(var i=0; i<items.length; i++){
            let ckbox = <HTMLInputElement>items[i];
            ckbox.checked = false;
        }
        this.contactList=[];
        // console.log(this.contactList);
    }


    onChange(num){
        if(this.contactList.includes(num)){
            const index = this.contactList.indexOf(num);
            if (index !== -1) {
                this.contactList.splice(index, 1);
            }
        }else{
            this.contactList.push(num);
        }
        // console.log(this.contactList);
    }

    onSubmit(){
        // this.isLoading = true;
        this.formmatModalOpen = false;
        this.broadcastForm.value.emails = this.contactList;
        this.broadcastForm.value.items = this.itemList;
        console.log(this.broadcastForm.value);
        
        this.commonService.sendEmailWithItemstemplate(this.broadcastForm.value).subscribe(
            res=>{
                this.isLoading = false;
            }
        );
        this.contactList=[]
        // console.log(this.broadcastForm.value);
    }

    onSendEmail(){
        if( this.contactList.length){
            this.formmatModalOpen = true;
        }else{
            alert("please select contact");
        }
    }

    onCancel(){
        this.formmatModalOpen = false;
    }

    lastPage(){
        this.isLoading = true;
        this.currentPage = this.currentPage-1;
        if(this.lastPageUrl){
            this.getCompanyContactsByUrl(this.lastPageUrl);
        }else{
            this.isLoading = false;
        }
    }

    nextPage(){
        this.isLoading = true;
        this.currentPage = this.currentPage+ 1;
        if(this.nextPageUrl){
            this.getCompanyContactsByUrl(this.nextPageUrl);
        }else{
            this.isLoading = false;
        }
    }

    exactPage(pageNumber){
        this.getCompanyContactsByUrl(this.defaultUrl+pageNumber);
    }
    getCompanyContactsByUrl(value){
        this.isLoading = true;
        this.broadcastService.getContactListByPage(value).subscribe(
            res=>{
                this.companyContacts = res.data;
                this.lastPageUrl = res.paging.previous;
                this.nextPageUrl = res.paging.next;
                this.currentPage = res.paging.currentPage;
                this.isLoading = false;
            }
        )
    }

    sendEmail(){

        if( this.contactList.length){
            this.router.navigate([`company/${this.currentLoginCompanyId}/broadcast/${this.currentType}/sendEmail`,{contactsList: this.contactList}]);
        }else{
            alert("please select contact")
        }
       
    }

    openProductModal(){
        this.showAddProductModal = true;
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
       this.selectedProduct = value
        console.log(this.itemList);
     }

     cancelAddProduct(){
        this.showAddProductModal = false;
     }

     addProduct(value){
        this.itemList.push(value);
        this.showAddProductModal = false;
     }
}