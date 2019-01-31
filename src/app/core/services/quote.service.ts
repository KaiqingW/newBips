import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class QuoteService{
    quoteNotes;
    constructor(private http: HttpClient){
    }

    getQuoteList(company_id, customer_id, q:string = 'quote'): Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/salesentity?type=${q}`);
    }

    getAdminQuoteCenterList(company_id, type:string, status:string):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/salesentity/by_admin?type=${type}&status=${status}`);
    }

    getQuoteWithCustomerIdTypeAndStatus(company_id, salesentity_id, type, status):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${salesentity_id}/salesentity?type=${type}&status=${status}`)
    }

    getQuote(company_id, salesentity_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/salesentity/${salesentity_id}`)
    }

    getAShopOrderAllInvoices(company_id, shop_order_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/shop/salesentity/${shop_order_id}`)
    }

    getQuoteListByUrl(url):Observable<any>{
        return this.http.get(url);
    }

    addQuote(company_id, customer_id, salesEntity):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/salesentity`, salesEntity);
    }

    addQuoteToOrcaShop(company_id, vender_company_id, customer_id, salesEntity):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/vender/${vender_company_id}/customer/${customer_id}/salesentity`, salesEntity);
    }

    getSalesOrderList(company_id, customer_id, q:string = 'salesorder'): Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/salesentity?type=${q}`);
    }

    getInvoiceList(company_id, customer_id, q:string = 'invoice'): Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/salesentity?type=${q}`);
    }

    quoteSearchByTime(company_id, customer_id, start_time, end_time): Observable<any>{
        return this.http.get(environment.ORCA_API + `search/company/${company_id}/customer/${customer_id}/salesentity?st=${start_time}&et=${end_time}`)
    }

    salesEntityFilter(company_id, customer_id, fname, ftype, start_time, end_time): Observable<any>{
        return this.http.get(environment.ORCA_API + `filter/company/${company_id}/customer/${customer_id}/salesentity?fname=${fname}&ftype=${ftype}&st=${start_time}&et=${end_time}`)
    }

    editSalesEntity(company_id, salesentity_id, value):Observable<any>{
        return this.http.patch(environment.ORCA_API + `company/${company_id}/salesentity/${salesentity_id}`, value);
    }

    //quote center by user

    quoteCenterGetList(company_id, type, status):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/salesentity?type=${type}&status=${status}`);
    }

    quoteCenterAdd(company_id, type, request):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/salesentity?type=${type}`, request);
    }

    searchCrmCustomer(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/`);
    }

    getQuotesByVendor(company_id, $customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/vendor/${$customer_id}/salesentity`);
    }

    //change salesentity status
    changeSalesentityStatus(company_id, salesentity_id, status):Observable<any>{
        return this.http.patch(environment.ORCA_API + `company/${company_id}/salesentity/${salesentity_id}/change_status?status=${status}`, {});
    }

    getProductPriceWithProductIdAndWarehouseId(company_id, warehouse_id, product_id, quantity):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/warehouse/${warehouse_id}/product/${product_id}/wholesaleprice/qty/${quantity}`);
    }

    getNormalUserAllInvoices(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/salesentity/all_invoice`);
    }

    generateSalesOrderFromQuote(company_id, salesentity_id):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/salesentity/${salesentity_id}/generateSalesOrder`, null);
    }

    getSalesentityWithoutToken(company_id, salesentity_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/salesentity/${salesentity_id}/no_token`);
    }

    changeSalesentityWithoutToken(company_id, salesentity_id, value):Observable<any>{
        return this.http.patch(environment.ORCA_API + `company/${company_id}/salesentity/${salesentity_id}/no_token`, value);
    }
}