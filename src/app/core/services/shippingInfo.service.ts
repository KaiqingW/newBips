import { Injectable } from "@angular/core";
import { environment } from 'environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShippingInfoService{
    constructor(private http: HttpClient){}
   
    selectedShippingInfo;
    currentShippingInfoIndex: number;
    currentItem : any;
    order_item_shipping_method : string;

    public addBatch(company_id, order_item_shipping_id, batchInfo) : Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/order_item_shipping/${order_item_shipping_id}/batch`, batchInfo);
    }

    public getShippingInfoCollection(company_id, order_item_id, type) : Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/order_item/${order_item_id}/order_item_shipping?type=${type}`);
    }

    public getNextShippingCollection(next) : Observable<any>{
        return this.http.get(next);
    }

    public addShippingInfo(company_id, order_item_id, info) : Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/order_item/${order_item_id}/order_item_shipping`, info);
    }

    public confirmShippingDate(company_id, order_item_id, order_item_shipping_id, shippingInfo) : Observable<any>{
        return this.http.patch(environment.ORCA_API + `company/${company_id}/order_item/${order_item_id}/order_item_shipping/${order_item_shipping_id}`, shippingInfo);
    }

    public setSelectedShippingInfo(info, index, item, order_item_shipping_method){
        this.selectedShippingInfo = info;
        this.currentShippingInfoIndex = index;
        this.currentItem = item;
        this.order_item_shipping_method = order_item_shipping_method;
    }

    public getSelectedShippingInfo(){
        return this.selectedShippingInfo;
    }

    public getCurrentShippingInfoIndex(){
        return this.currentShippingInfoIndex;
    }

    public getCurrentItem(){
        return this.currentItem;
    }

    public getOrderItemShippingType(){
        return this.order_item_shipping_method;
    }
}