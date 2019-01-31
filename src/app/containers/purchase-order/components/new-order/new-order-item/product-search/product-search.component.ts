import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators,
    FormArray,
    ReactiveFormsModule
  } from "@angular/forms";
import { OrdersService } from 'app/core/services/orders.service';
import {Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { Product } from 'app/core/models/index';
import { CommonService } from 'app/core/services/common.service';
import { InventoryService } from '../../../../../../core/services/inventory.service';
import { SearchService } from '../../../../../../core/services/search.service';


  @Component({
    selector:'app-product-search',
    templateUrl:'./product-search.component.html',
    styleUrls:['./product-search.component.scss']
  })
  
  export class ProductSearchComponent implements OnInit{
    productList: Product[];
    @Input() companyId : number;
    searchCtrl: FormControl;
    next;
    refreshHeight : number = 300;
    isLoading: boolean = false;
    @Output() sendProduct :  EventEmitter<any> = new EventEmitter();
    company_id: number;
    options = ['Item#', 'Name', 'Description'];
    defaultOption = this.options[0];
    searchPlaceholder = 'Search By ' + this.options[0];
    optionPlaceholder = 'Search Type';

    constructor(
        private fb: FormBuilder,
        private ordersService: OrdersService,
        private router:Router,
        private route: ActivatedRoute,
        private location: Location,
        private commonService :CommonService,
        private inventoryService : InventoryService,
        private searchService : SearchService
    ) {
      this.searchCtrl = new FormControl();
      this.searchCtrl.valueChanges.subscribe(
        (term) => {
          this.onSearch(term);
        }
      )
      this.company_id = + this.route.snapshot.paramMap.get('cid');

     }
    
    ngOnInit(){
      this.getProducts();
    }
    
    onGetSearch(obj) {
      let option = obj.option, term = obj.term;
      let queryString = "";
      switch (option) {
        case "Name":
        case "Description":
          queryString = option.toLowerCase() + "=" + term;
          break;
        case "Item#":
          queryString = 'headline' + "=" + term;
          break
      }
      this.onSearch(queryString);
    }

    onNavToDetail($event, id){
      let pid = +id;
      $event.stopPropagation();
     
      if(id){
        this.router.navigateByUrl(`/company/${this.company_id}/inventory/product/${pid}`);
      }
    }

    getProducts(){
      this.isLoading = true;
      this.inventoryService.getProductList(this.companyId).subscribe(
        (res) => {
          this.isLoading = false;
          this.productList = res.data;
          this.next = res.paging.next;
        }
      )
    }

    // onSearch(value){
    //   this.isLoading = true;
    //   this.commonService.searchFieldOfTable(this.companyId, 'inventory', 'product', 'name', value, 'desc').subscribe(
    //     (res) => {
    //       this.isLoading = false;
    //       this.productList = res['data'];
    //     }
    //   )
    // }
    
    onSearch(queryString) {
      this.searchService.searchProduct(this.company_id, queryString).subscribe(
        (res) => {
          this.refreshHeight = 400;
          this.productList = res.data;
          this.next = res.paging.next;
        }
      )
    }

    onMouseWheel(evt){
      if(evt.target.scrollTop >  this.refreshHeight ){
        if(this.next && !this.isLoading){
           this.refreshHeight += 300;
           this.isLoading = true;
           this.getPagingProducts();
         }
      }
    }

    onNavigate(){
      this.isLoading = true;
      this.router.navigateByUrl(`/company/${this.companyId}/inventory/product/addProduct`).then(
        () => {
          this.isLoading = false;
        }
      )
    }

    getPagingProducts(){
      this.isLoading = true;
      this.inventoryService.getPagingProducts(this.next).subscribe(
        (res) => {
          this.isLoading = false;
          this.productList = this.productList.concat(res.data);
          this.next = res.paging.next;
        },
        (err) => {
          this.isLoading = false;
        }
      )
    }

    selectProduct(product){
      this.sendProduct.emit(product);
    }
  }