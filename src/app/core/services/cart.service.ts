import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class CartService {

  value;
  shop_id = 171;

  constructor(
    private http: HttpClient,
  ) {
  }

  public getMe(): Observable<any> {
    return this.http.get(environment.ORCA_API + `shop/me`);
  }

  public getCompany(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `shop/company/${company_id}`);
  }

  public getCartList(company_id, vb_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/shop/${vb_id}/shopping_cart`);
  }

  public addToCart(company_id, vb_id, value): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/shop/${vb_id}/shopping_cart`, value);
  }

  public deleteItemfromCart(order_id, company_id, whs_id, item_id) {
    return this.http.delete(environment.ORCA_API + `company/${this.shop_id}/shop/shopping_cart?o=${order_id}&c=${company_id}&w=${whs_id}&p=${item_id}`);
  }

  public emptyCart(order_id) {
    return this.http.delete(environment.ORCA_API + `company/171/shop/shopping_cart/${order_id}`);
  }

  public updateCart(order_id, value) {
    return this.http.patch(environment.ORCA_API + `company/171/shop/shopping_cart/${order_id}`, value);
  }

  public addAddr(vb_id, value) {
    return this.http.post(environment.ORCA_API + `company/${vb_id}/address`, value);
  }

  public defaultAddr(addr_id) {
    this.value = { "type": "shipping_default" };
    console.log(this.value);
    return this.http.patch(environment.ORCA_API + `address/default_shipping/${addr_id}`, this.value);
  }

  public deleteAddr(addr_id) {
    return this.http.delete(environment.ORCA_API + `address/${addr_id}`);
  }

  public placeOrder(value) {
    return this.http.post(environment.ORCA_API + `company/171/shop/shop_order`, value);
  }

  public getDiscount(value) {
    return this.http.get(environment.ORCA_API + `company/${value}/shop/discount`);
  }

  public getShopPriceLimit(compId) {
    return this.http.get(environment.ORCA_API + `company/${this.shop_id}/shop_vendor/${compId}`);
  }

  public getProductInfo(company_id, product_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/shop/product/${product_id}`);
  }

  public getRetailPriceTable(company_id, product_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/shop/product/${product_id}/retailprice`);
  }

  public getProductsByType(type): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/171/shop/product/by_type?type=${type}`);
  }
  
  public getCartNumber(vb_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/171/shop/${vb_id}/shopping_cart/products_number`);
  }

}
