import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';

import 'rxjs/add/operator/map';
import { Subject } from 'rxjs';

@Injectable()
export class WarehouseService {
  
  constructor(private http: HttpClient) { }

  selectedProducts = [];
  // public getGeolocationFromGoogle(zipcode): Observable<any>{
  //   return this.http.get(environment.GOOGLE_MAP_API + `address=${zipcode}&key=${environment.GOOGLE_MAP_API_KEY}`);
  // }
  // get all warehouse from one company
  public getWarehouseCollection(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/warehouse`);
  }

  public getWarehouseCollectionNoPaging(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/warehouse?noPaging=1`);
  }
  
  public getNextWarehouses(next) : Observable<any>{
    return this.http.get(next);
  }

  public getOneWarehouse(company_id, warehouse_id) : Observable<any>{
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/warehouse/${warehouse_id}`);
  }

  public addOneWarehouse(company_id, warehouse) : Observable<any>{
    return this.http.post(environment.ORCA_API +  `company/${company_id}/inventory/warehouse`, warehouse);
  }

  public getMonthlyContainers(company_id , warehouse_id, date) : Observable<any>{
    return this.http.get(environment.ORCA_API + `company/${company_id}/warehouse/${warehouse_id}/containers/${date}`);
  }  

  public getContainerDetail(company_id, container_number) : Observable<any>{
    var code = encodeURIComponent(container_number);
    return this.http.get(environment.ORCA_API + `company/${company_id}/containers/detail/${code}`);
  }

  public getBatches(company_id, order_item_id, containerNum) : Observable<any>{
    var code = encodeURIComponent(containerNum);
    return this.http.get(environment.ORCA_API + `company/${company_id}/order_item_shipping/${order_item_id}/container/${code}/batch`);
  }

  public updateBatchInfos(company_id, order_item_shipping_batch_id, updateInfos) : Observable<any>{
    return this.http.patch(environment.ORCA_API + `company/${company_id}/order_item_shipping/batch/${order_item_shipping_batch_id}`, updateInfos);
  }

  public setSelectedProducts(products){
    this.selectedProducts = products;
  }

  public getSelectedProducts(){
    return this.selectedProducts;
  }

  public clearSelectedProducts(){
    this.selectedProducts = [];
  }
}
