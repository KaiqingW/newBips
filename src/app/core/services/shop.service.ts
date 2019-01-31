import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ShopService {

    constructor(private http: HttpClient) { }

    search_obj;
    productName;
    login_status;
    getNextPaging = new Subject<any>();

    // get orcashop product list
    public getShopProductList(company_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/shop/product`);
    }

    // search all public products basing on search term
    public searchPublicProduct(company_id, as_showcase, term): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/showcase/${as_showcase}/term?t=${term}`);
    }

    // get orcashop product category
    public getShopCategory(): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/171/shop/category`);
    }

    // update shop product category
    public updateShopProductCategory(company_id, product_id, obj): Observable<any> {
        return this.http.patch(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/category`, obj);
    }

    //update shop product shop_status
    public updateShopProductStatus(company_id, product_id, obj): Observable<any> {
        return this.http.patch(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/shop_status`, obj);
    }

    public updateProduct(company_id, product_id, obj): Observable<any> {
        return this.http.patch(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}`, obj);
    }

    public addProductFromCompanyToOrcashop(shop_id, obj) : Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${shop_id}/shop/product`, obj);
    }

    // get all shop purchase order
    public getShopPurchaseOrders(shop_id, buyer_company_id) : Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${shop_id}/shop/${buyer_company_id}/shop_order`);
    }

    // get shop order detail
    public getShopOrderDetail(company_id, order_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/shop/shop_order/${order_id}`);
    }
    //get all sell orders from company
    public getSellOrders(company_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/shop/shop_order`);
    }

    public getSellOrdersOnWarehouseId(company_id, warehouse_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/shop/shop_order/${warehouse_id}`);
    }

    //get shop user's id
    public getShoperInfo(): Observable<any> {
        return this.http.get(environment.ORCA_API + `shop/me`);
    }

    //
    public updateOrderShippingStatus(company_id, warehouse_id, obj): Observable<any> {
        return this.http.patch(environment.ORCA_API + `company/${company_id}/shop/shop_order_warehouse/${warehouse_id}`, obj);
    }

    public deleteShopProduct(self_company, product_id) : Observable<any>{
        return this.http.delete(environment.ORCA_API + `company/171/shop/${self_company}/product/${product_id}`);
    }

    // get orcashop viewed products list
    public getShopViewedProductList(self_company): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/171/shop/${self_company}/view_products`);
    }

    // add orcashop viewed product
    public addShopViewedProduct(self_company, value): Observable<any> {
        return this.http.post(environment.ORCA_API + `company/171/shop/${self_company}/view_product`, value);
    }

    public setSearchObj(search_obj){
        this.search_obj = search_obj;
        console.log(this.search_obj);
    }

    public getSearchObj(){
        return this.search_obj;
    }

    public setProductName(productName){
        this.productName = productName;
        console.log(this.productName);
    }

    public getProductName(){
        return this.productName;
    }

    public setLoginStatus(){
        this.login_status = "true";
        console.log(this.login_status);
    }

    public getLoginStatus(): Observable<any> {
        return this.login_status;
    }

    // Observable string sources
    private emitChangeSource = new Subject<any>();
    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }

}