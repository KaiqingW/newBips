import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'app/core/models/index';
import { InventoryService } from 'app/core/services/inventory.service';
import { CartService } from 'app/core/services/cart.service';
import { ShopService } from 'app/core/services/shop.service';
import { SearchService } from '../../core/services/search.service';
import { Store } from '@ngrx/store';
import { StoreState } from 'app/core/models/store-state';
import { AuthService } from 'app/core/services/auth.service';
import * as AuthActions from 'app/core/actions/auth.action';
import { ToasterService } from 'app/core/services/toaster.service';
import { DialogService } from 'app/core/services/dialog.service';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  // @Input() search_obj;
  currentLoginCompanyId;
  vb_id;
  productList;
  selectedProduct: Product;
  categories;
  events: string[] = [];
  opened: boolean;
  isLoading = true;
  search_obj = {};
  if_login: boolean;
  user_name;
  firstCate;
  secondCate;
  thirdCate;
  productListRecommended;
  productListOnSale;
  productListNewArrival;
  cartNum;

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private cartService: CartService,
    private shopService: ShopService,
    private searchService: SearchService,
    private authService: AuthService,
    private store: Store<StoreState>,
    private toasterService: ToasterService,
    private dialogService: DialogService,
  ) {

    this.currentLoginCompanyId = 171;
    this.getProducts();
    this.getProductsByType('recommended_product');
    this.getProductsByType('on_sale');
    this.getProductsByType('new_arrival');
    this.getVbId();
    if (localStorage.getItem("orcasmart_access_token")) {
      this.if_login = true;
    } else {
      this.if_login = false;
    }
  }

  ngOnInit() {

  }

  // onMouseWheel(evt){
  //   console.log(evt);
  //   if(evt.target.scrollTop >  this.refreshHeight ){
  //     if(this.next){
  //        this.refreshHeight += 1;
  //       //  this.isLoading = true;
  //        this.getPagingProducts();
  //      }
  //   }
  // }

  getServiceProducts() {
    if (this.shopService.getProductName()) {
      this.onGetTerm(this.shopService.getProductName())
    } else if (this.shopService.getSearchObj()) {
      this.search_obj = this.shopService.getSearchObj();
      console.log(this.search_obj);
      this.searchProduct();
    } else {
      this.getProducts()
    }
  }

  getProducts() {
    this.inventoryService.getShopProductList(this.currentLoginCompanyId).subscribe(
      (res) => {
        this.productList = res.data;
        console.log(res);
        this.isLoading = false;
      }
    )
  }

  getVbId() {
    if (localStorage.getItem("orcasmart_access_token")) {
      this.cartService.getMe().subscribe(
        (res) => {
          //console.log(res);
          this.user_name = res.user.first_name;
          for (let i = 0; i < res.user.employed_companies.length; i++) {
            if (res.user.employed_companies[i].type == 0) {
              this.vb_id = res.user.employed_companies[i].id;
              console.log(this.vb_id);
              this.cartService.getCartNumber(this.vb_id).subscribe(
                res => {
                    this.cartNum = res;
                    console.log(this.cartNum);
                    return res;
                }
              );
            }
          }
        }
      )
    }
  }

  getProductsByType(type) {
    console.log(type);
    this.cartService.getProductsByType(type).subscribe(
      (res) => {
        console.log(res);
        if (type == 'recommended_product') {
          this.productListRecommended = res.data;
        } else if (type == 'on_sale') {
          this.productListOnSale = res.data;
        } else if (type == 'new_arrival') {
          this.productListNewArrival = res.data;
        }
        // console.log(name);
      }
    )
  }

  onNavToDetail($event, prodid, shopcid, shoppid) {
    this.isLoading = true;
    let cid = +shopcid;
    let pid = +shoppid;
    $event.stopPropagation();

    if (cid && pid) {
      let obj = new Object;
      obj['product_id'] = prodid;
      console.log(obj);
      if (this.vb_id) {
        this.shopService.addShopViewedProduct(this.vb_id, obj).subscribe(
          (res) => {
            console.log(res);
            this.router.navigateByUrl(`/shop/item/${cid}/${pid}`);
            // document.location.href = environment.ORCA_SHOP_API + 'shop/item/' + cid + '/' + pid;
          }
        )
      } else {
        this.router.navigateByUrl(`/shop/item/${cid}/${pid}`);
      }
    }
  }

  onNavToCate($event, cate) {
    this.isLoading = true;
    let category = "Electronics";
    $event.stopPropagation();
    this.router.navigateByUrl(`/shop/item/${category}`);
  }

  onGetTerm(term) {
    Object.assign(this.search_obj, { name: term });
    console.log(this.search_obj);
    this.searchProduct();
  }

  // onGetFilterObj(obj) {
  //   this.search_obj = {
  //     name: this.search_obj['name']
  //   }
  //   Object.assign(this.search_obj, obj);
  //   console.log(this.search_obj);
  //   this.searchProduct();
  // }

  onGetFilterObj(obj) {
    this.search_obj = {
      name: this.search_obj['name']
    }
    Object.assign(this.search_obj, obj);
    console.log(this.search_obj);
    this.shopService.setSearchObj(this.search_obj);
    this.onNavToCategory("cate");
  }

  onNavToCategory(cate) {
    this.isLoading = true;
    console.log(this.search_obj);
    this.shopService.setSearchObj(this.search_obj);
    let category = "Electronics";
    this.router.navigateByUrl(`/shop/item/${category}`);
  }


  onGetClear(clear) {
    console.log(this.search_obj);
    if (clear) {
      this.search_obj = {};
      this.search_obj['name'] = null;
      console.log(this.search_obj);
      this.firstCate = null;
      this.secondCate = null;
      this.thirdCate = null;
      this.getProducts();
    }
  }

  searchByNav(level) {
    console.log(level);
    if (level == 'first') {
      console.log('11111');
      this.search_obj['second_category'] = null;
      this.search_obj['third_category'] = null;
      console.log(this.search_obj);
    }
    if (level == 'second') {
      console.log('22222');
      this.search_obj['third_category'] = null;
      console.log(this.search_obj);
    }
    if (level == 'third') {
      console.log('33333');
      console.log(this.search_obj);
    }
    console.log(this.search_obj);
    this.searchProduct();
  }

  searchProduct() {
    this.isLoading = true;
    console.log(this.search_obj);
    if (this.search_obj['first_category']) {
      this.firstCate = this.search_obj['first_category'];
      console.log(this.firstCate);
      if (this.search_obj['second_category']) {
        this.secondCate = this.search_obj['second_category'];
        console.log(this.secondCate);
        if (this.search_obj['third_category']) {
          this.thirdCate = this.search_obj['third_category'];
          console.log(this.thirdCate);
        } else {
          this.thirdCate = null;
        }
      } else {
        this.secondCate = null;
        this.thirdCate = null;
      }
    } else {
      this.firstCate = "All Departments";
      this.secondCate = null;
      this.thirdCate = null;
    }
    this.searchService.searchShopProduct(this.currentLoginCompanyId, this.search_obj).subscribe(
      (res) => {
        this.isLoading = false;
        this.productList = res.data;
        console.log(this.productList);
      }
    )
  }
  // getPagingProducts(){
  //   if(!this.isLoading){
  //     this.isLoading = true;
  //     this.inventoryService.getPagingProducts(this.next).subscribe(
  //       (res) => {
  //         this.isLoading = false;
  //         this.productList = this.productList.concat(res.data);
  //         console.log(this.productList);
  //         this.next = res.paging.next;
  //       },
  //       (err) => {
  //         this.isLoading = false;
  //       }
  //     )
  //   }

  // }

  selectProduct(product) {
    // this.total = 0;
    this.selectedProduct = product;
    // this.warehouses = product.warehouses;
    // this.total = product.total_amount;
  }

  topFunction() {
    // this.document.body.sscrollTop = 0;
    window.scroll(0, 0);
  }

  getFirstSelect(categories) {
    console.log(categories);
  }

  setProfile() {
    if (localStorage.getItem("orcasmart_access_token")) {
      this.router.navigate(['/setting/profile']);
    } else {
      this.router.navigate(['/auth/signin']);
    }
  }

  checkAuth() {
    if (!localStorage.getItem("orcasmart_access_token")) {
      this.router.navigate(['/auth/login']);
    }
  }

  orderHistory() {
    if (localStorage.getItem("orcasmart_access_token")) {
      this.router.navigate(['/shop-order/orders']);
    } else {
      this.router.navigate(['/auth/signin']);
    }
  }

  setAllCategory() {
    let search_obj = {};
    search_obj['name'] = "";
    search_obj['first_category'] = null;
    this.setLocalCate(search_obj);
  }

  setLocalCate(search_obj) {
    let category = JSON.stringify(search_obj);
    localStorage.setItem('category', category);
    this.router.navigateByUrl(`/shop/item/${category}`);
  }

  toShoppingCart() {
    if (localStorage.getItem("orcasmart_access_token")) {
      this.router.navigate(['/shop/shopping-cart']);
    } else {
      this.router.navigate(['/auth/signin']);
    }
  }

  logout() {
    let message = "Are you sure to logout?"

    this.dialogService.openCustomizedSureDialog(message).subscribe(
      res => {
        if (res) {
          this.authService.removeOrcaToken();
          this.vb_id = null;
          this.store.dispatch(new AuthActions.LogoutSuccess());
          this.toasterService.showToaster('logged out!', 'ok', 3000);
          this.if_login = false;
          // this.shopService.emitChange(false);
          location.reload();
        }
      })
  }
}
