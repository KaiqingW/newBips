import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
import { query } from '@angular/animations';

@Injectable()
export class SearchService {
    constructor(private http: HttpClient) { }

    // fuzzy search company by name
    searchCompany(name: string): Observable<any> {
        return this.http.get(environment.ORCA_API + `search/company?q=${name}`);
    }
    // accurate search company by name
    searchCompanyAccurate(name: string): Observable<any> {
        const accurate = true;
        return this.http.get(environment.ORCA_API + `search/company?q=${name}$e=${accurate}`);
    }

    searchAccountCompany(company_id: number, name: string, brief: string, company_type: string): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/search/crm?t=company&f=name&q=${name}&o=asc&brief=${brief}&company_type=${company_type}`);
    }

    searchCompanyEmployee(value: string, company_id: number): Observable<any> {
        return this.http.get(environment.ORCA_API + `search/employee?q=${value}&c_id=${company_id}`);
    }

    // searchOrder(company_id, search_obj): Observable<any> {
    //     let queryString = '';
    //     Object.keys(search_obj).forEach(key => {
    //         if (queryString.length > 1) {
    //             queryString = queryString + '&' + key + '=' + search_obj[key];
    //         } else {
    //             queryString = queryString + key + '=' + search_obj[key];
    //         }
    //     })
    //     return this.http.get(environment.ORCA_API + `search/company/${company_id}/order?${queryString}`);
    // }
    searchOrder(company_id, queryString): Observable<any> {
        return this.http.get(environment.ORCA_API + `search/company/${company_id}/order?${queryString}`);
    }

    searchOrderItemShipping(company_id, search_obj): Observable<any> {
        let queryString = '';
        search_obj['container_number'] = encodeURIComponent(search_obj['container_number']);
        queryString = this.convertObjectToQuery(search_obj, queryString);
        return this.http.get(environment.ORCA_API + `company/${company_id}/order_item_shipping/search?${queryString}`);
    }

    searchOrderItemShippingByCustomer(vender_id, customer_id, queryString): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${vender_id}/customer/${customer_id}/order_item_shipping/search?${queryString}`);
    }

    searchOrderItemShipping2(company_id, queryString): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/order_item_shipping/search?${queryString}`);
    }

    searchProduct(company_id, queryString): Observable<any> {
        return this.http.get(environment.ORCA_API + `search/company/${company_id}/product?${queryString}`);
    }

    searchShopProduct(company_id, search_obj): Observable<any> {
        let queryString = '';
        queryString = this.convertObjectToQuery(search_obj, queryString);
        console.log(queryString);
        return this.http.get(environment.ORCA_API + `search/company/${company_id}/shop/product?${queryString}`);
    }

    convertObjectToQuery(search_obj, queryString) {
        Object.keys(search_obj).forEach(key => {
            if (search_obj[key]) {
                if (queryString.length > 1) {
                    queryString = queryString + '&' + key + '=' + search_obj[key];
                } else {
                    queryString = queryString + key + '=' + search_obj[key];
                }
            }
        })
        return queryString;
    }

    public getProductsForShopManagement(company_id, query) : Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/search_product_for_shop_management?${query}`);
    }

    public searchSharedOrder(vendorCompanyId, selfCompanyId, queryString): Observable<any> {
        return this.http.get(environment.ORCA_API + `search/company/${vendorCompanyId}/sharing/order/${selfCompanyId}?${queryString}`);
    }

    public searchVenderByName(selfCompanyId, term): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${selfCompanyId}/vrm/customer/vrm_search?name=${term}`);
    }

    // search customer company's name in CRM by sales, now used by department-opportunity, editted by yali
    public searchCRMCompany(company_id, name: string, admin): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/crm_search?name=${name}&admin=${admin}`);
    }
    
    // search customer company's name in CRM by sales, now used by department-opportunity, editted by yali
    // right now used for opportunity
    public searchCRMCompanyForOpportunity(company_id, name: string, admin, user_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/crm_search?name=${name}&admin=${admin}&userId=${user_id}`);
    }

    public searchCRMCompanyWithoutId(company_id, name:string ):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/crm_search_wtid?name=${name}`);
    }

    getSearchProductsByUrl(url):Observable<any>{
        return this.http.get(url);
    }

}