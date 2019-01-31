import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from './../../../../app/core/models/index';
import { InventoryService } from './../../../../app/core/services/inventory.service';
import { FormControl } from '@angular/forms';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs';
import { CommonService } from 'app/core/services/common.service';
import { VrmBaBaService } from 'app/containers/vrm/vrm.service';
import { SearchService } from 'app/core/services/search.service';

@Component({
  selector: 'app-showcase-list',
  templateUrl: './showcase-list.component.html',
  styleUrls: ['./showcase-list.component.scss']
})
export class ShowcaseListComponent implements OnInit {
// Lead$: Observable<Lead>;
  currentLoginCompanyId;
  productList: Product[];
  refreshHeight : number = 0;
  next = '';
  isLoading : boolean = false;
  selectedProduct: Product;
  categories;
  searchCtrl: FormControl;

  /********** begin edit by Simon let the other company can access the showcase  */
  currentWholeUrl;
  currentVenderId;
  currentVenderName;
  currentVenderCompanyId;
  /**********end edit by Simon **************************************************/
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private commonService : CommonService,
    private vrmBaBaService: VrmBaBaService,
    private searchService : SearchService,
    
  ) {
    this.isLoading = true;
    this.currentWholeUrl = document.URL;
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');  
    this.currentVenderId = this.route.snapshot.paramMap.get('ven_id');  
    this.categories = ["Tequila", "Spirits", "Ejuice", "Food & Beverage"];
    this.searchCtrl = new FormControl();
    this.searchCtrl.valueChanges.subscribe(
      (term) => {
        this.onSearch(term);
      }
    )
  }

  ngOnInit() {

      /********** begin edit by Simon  if come from vrm  ******************/
      if(this.currentWholeUrl.toLowerCase().includes('vrm')){
        this.vrmBaBaService.getVendor(this.currentLoginCompanyId,this.currentVenderId).subscribe(
            res=>{
                this.currentVenderName = res.name;
                this.searchService.searchCompany(this.currentVenderName).subscribe(
                    res=>{
                        this.currentVenderCompanyId = res.data[0].id;
                        this.inventoryService.getProductByShowcase(this.currentVenderCompanyId, 5).subscribe(
                            (res) => {
                                this.productList = res.data;
                                this.isLoading = false;
                                this.next = res.paging.next;
                                if(this.next && this.next.split("=")[1]=="2"){
                                  this.getPagingProducts();
                                }
                        })
                    }
                )
            }
        )
    /********** end edit by Simon  if come from vrm  ******************/
    }else{
      this.getShowcaseList();
      this.isLoading = false;
    }
  }

  onSearch(value){
    this.commonService.searchFieldOfTable(this.currentLoginCompanyId, 'inventory', 'product', 'category', value, 'desc').subscribe(
      (res) => {
        this.productList = res['data'];
      }
    )
  }

  onMouseWheel(evt){
    console.log(this.refreshHeight);
    if(evt.target.scrollTop >  this.refreshHeight ){
      if(this.next){
         this.refreshHeight += 600;
         this.getPagingProducts();
       }
    }
  }

  getShowcaseList(){
    this.inventoryService.getProductByShowcase(this.currentLoginCompanyId, 5).subscribe(
      (res) => {
        this.productList = res.data;
        this.next = res.paging.next;
        if(this.next && this.next.split("=")[1]=="2"){
          this.getPagingProducts();
        }
      }
    )
  }
  
  getPagingProducts(){
    if(!this.isLoading){
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
    
  }
  
  selectProduct(product) {
    // this.total = 0;
    this.selectedProduct = product;
    // this.warehouses = product.warehouses;
    // this.total = product.total_amount;
  }

}
