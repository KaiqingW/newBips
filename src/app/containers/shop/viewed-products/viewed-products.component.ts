import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from "../../../core/services/cart.service";
import { ShopService } from "../../../core/services/shop.service";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-viewed-products',
  templateUrl: './viewed-products.component.html',
  styleUrls: ['./viewed-products.component.scss']
})
export class ViewedProductsComponent implements OnInit {

  // @Input() SelfCompanyId;
  vb_id;
  viewedProductsList;
  isLoading = true;

  constructor(
    private router: Router,
    private cartService: CartService,
    private shopService: ShopService,

  ) { 
    this.getViewedProductsList();
    localStorage.setItem('is_shop', '0');
  }

  ngOnInit() {
  }

  getViewedProductsList() {

    this.cartService.getMe().subscribe(
      (res) => {
        //console.log(res);
        for (let i = 0; i < res.user.employed_companies.length; i++) {
          if (res.user.employed_companies[i].type == 0) {
            this.vb_id = res.user.employed_companies[i].id;
            this.shopService.getShopViewedProductList(this.vb_id).subscribe(
              (res) => {
                console.log(res);
                this.viewedProductsList = res.shop_customer_viewed_products.data;
                this.isLoading = false;
              }
            )
          }
        }
      }
    )
  }

  onNavToDetail($event, prodid, shopcid, shoppid) {
    localStorage.setItem('is_shop', '1');
    this.isLoading = true;
    let cid = +shopcid;
    let pid = +shoppid;
    $event.stopPropagation();

    if (cid && pid) {
      let obj = new Object;
      obj['product_id'] = prodid;
      console.log(obj);
      this.shopService.addShopViewedProduct(this.vb_id, obj).subscribe(
        (res) => {
          console.log(res);
          this.router.navigateByUrl(`/shop/item/${cid}/${pid}`);
          // document.location.href = environment.ORCA_SHOP_API + 'shop/item/' + cid + '/' + pid;
        }
      )
    }
  }

}
